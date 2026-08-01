import { getStore } from '@netlify/blobs';

const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40}$/;
const ALLOWED = new Set([
  'familia',
  'relacionamento',
  'emprego',
  'financeiro',
  'saude',
  'filhos',
  'emocional',
  'outro',
]);

const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });

const cleanName = (value) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 40);

async function readAll(store) {
  const { blobs } = await store.list({ prefix: 'request/' });
  const items = [];

  for (const blob of blobs.slice(-200)) {
    const value = await store.get(blob.key, {
      type: 'json',
      consistency: 'strong',
    });

    if (value) {
      items.push({ ...value, key: blob.key });
    }
  }

  items.sort((a, b) => b.createdAt - a.createdAt);
  return items;
}

export default async (request, context) => {
  try {
    // No formato moderno de Netlify Functions, o ambiente de Blobs
    // é injetado automaticamente durante a requisição.
    const store = getStore('prayer-wall');

    if (request.method === 'GET') {
      const items = await readAll(store);
      const since = Date.now() - 86_400_000;

      return json({
        items: items.slice(0, 16).map(
          ({ key, firstName, category, createdAt, prayers = 0 }) => ({
            id: key,
            firstName,
            category,
            createdAt,
            prayers,
          }),
        ),
        stats: {
          requests: items.length,
          today: items.filter((item) => item.createdAt >= since).length,
          prayers: items.reduce((sum, item) => sum + (item.prayers || 0), 0),
        },
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Método não permitido.' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Dados inválidos.' }, 400);
    }

    if (body.action === 'pray') {
      const key = String(body.id || '');

      if (!key.startsWith('request/')) {
        return json({ error: 'Pedido inválido.' }, 400);
      }

      const item = await store.get(key, {
        type: 'json',
        consistency: 'strong',
      });

      if (!item) {
        return json({ error: 'Pedido não encontrado.' }, 404);
      }

      item.prayers = (item.prayers || 0) + 1;
      await store.setJSON(key, item);

      return json({ ok: true, prayers: item.prayers });
    }

    const firstName = cleanName(body.firstName);
    const category = String(body.category || '');

    if (!NAME_RE.test(firstName)) {
      return json({ error: 'Informe apenas seu primeiro nome.' }, 400);
    }

    if (!ALLOWED.has(category)) {
      return json({ error: 'Escolha uma causa de oração.' }, 400);
    }

    const createdAt = Date.now();
    const key = `request/${String(createdAt).padStart(13, '0')}-${crypto.randomUUID()}`;

    await store.setJSON(key, {
      firstName,
      category,
      createdAt,
      prayers: 0,
    });

    return json({
      ok: true,
      id: key,
      firstName,
      category,
      createdAt,
      prayers: 0,
    });
  } catch (error) {
    console.error('prayers function error:', error);
    return json({ error: 'Não foi possível processar a oração agora.' }, 500);
  }
};
