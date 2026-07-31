export default {
  async fetch(request, env) {
    const cors = {"Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json"};
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
    if (request.method !== "POST") return Response.json({error:"Método não permitido"},{status:405,headers:cors});
    try {
      const body = await request.json();
      if (!body.email || !body.consent) return Response.json({error:"Dados inválidos"},{status:400,headers:cors});
      const r = await fetch("https://api.brevo.com/v3/contacts",{method:"POST",headers:{"Content-Type":"application/json","api-key":env.BREVO_API_KEY},body:JSON.stringify({email:body.email,attributes:{FIRSTNAME:body.firstName||"",PERFIL:body.profile||"",DIFICULDADE:body.difficulty||"",ORIGEM:body.source||"Nova Jornada"},listIds:[Number(env.BREVO_LIST_ID)],updateEnabled:true})});
      if(!r.ok) throw new Error(await r.text());
      return Response.json({ok:true},{headers:cors});
    } catch(e) {
      console.error(e); return Response.json({error:"Não foi possível cadastrar"},{status:500,headers:cors});
    }
  }
};
