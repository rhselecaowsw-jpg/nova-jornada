const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, body, origin = "*") {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      Vary: "Origin"
    },
    body: body == null ? "" : JSON.stringify(body)
  };
}

function getCorsOrigin(requestOrigin) {
  const configured = String(process.env.ALLOWED_ORIGIN || "*")
    .split(",")
    .map(value => value.trim().replace(/\/$/, ""))
    .filter(Boolean);

  if (configured.includes("*")) return "*";
  const normalizedRequest = String(requestOrigin || "").replace(/\/$/, "");
  return configured.includes(normalizedRequest) ? normalizedRequest : "";
}

exports.handler = async (event) => {
  const requestOrigin = event.headers?.origin || event.headers?.Origin || "";
  const corsOrigin = getCorsOrigin(requestOrigin);

  if (event.httpMethod === "OPTIONS") {
    return corsOrigin
      ? jsonResponse(204, null, corsOrigin)
      : jsonResponse(403, { error: "Origem não autorizada." }, "null");
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Método não permitido." }, corsOrigin || "null");
  }

  if (!corsOrigin) {
    return jsonResponse(403, { error: "Origem não autorizada." }, "null");
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.error("BREVO_API_KEY ou BREVO_LIST_ID ausente/inválido.");
    return jsonResponse(500, { error: "Integração ainda não configurada." }, corsOrigin);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Dados inválidos." }, corsOrigin);
  }

  const firstName = String(body.firstName || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
  const consent = body.consent === true;

  if (!EMAIL_RE.test(email) || !consent) {
    return jsonResponse(
      400,
      { error: "Preencha um e-mail válido e aceite o consentimento." },
      corsOrigin
    );
  }

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName || "Amigo(a)" },
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!brevoResponse.ok) {
      const detail = await brevoResponse.text();
      console.error("Erro Brevo:", brevoResponse.status, detail);
      return jsonResponse(502, { error: "Não foi possível concluir o cadastro agora." }, corsOrigin);
    }

    return jsonResponse(200, { ok: true }, corsOrigin);
  } catch (error) {
    console.error("Erro na função lead:", error);
    return jsonResponse(500, { error: "Não foi possível concluir o cadastro agora." }, corsOrigin);
  }
};
