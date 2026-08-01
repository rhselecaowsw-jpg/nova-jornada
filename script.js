const SHARE_TEXT=`🙏 Estou participando da corrente @123Deus.Sabe.\n\nHá batalhas que ninguém vê. Se existe uma causa no seu coração, você não precisa explicar. Pode apenas dizer: DEUS SABE.\n\nUma corrente continua quando um elo encontra outro. Seja o próximo elo:\n`;
const $=s=>document.querySelector(s);
function track(n,p={}){try{if(typeof gtag==='function')gtag('event',n,p)}catch(e){}}
function shareUrl(){return location.origin+location.pathname}
function setupShare(){$('#whatsappShare').href=`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT+shareUrl())}`}

let selectedCause='';
document.querySelectorAll('[data-cause]').forEach(btn=>btn.addEventListener('click',()=>{
  selectedCause=btn.dataset.cause;
  document.querySelectorAll('[data-cause]').forEach(b=>b.classList.toggle('selected',b===btn));
  $('#prayerEmailBox').classList.remove('hidden');
  $('#prayerEmailBox').scrollIntoView({behavior:'smooth',block:'center'});
  track('causa_oracao_escolhida',{causa:selectedCause});
}));

$('#desabafoBtn').addEventListener('click',()=>{
  $('#desabafo').classList.remove('hidden');
  $('#desabafo').scrollIntoView({behavior:'smooth'});
  track('abrir_desabafo');
});
$('#orarBtn').addEventListener('click',()=>{
  $('.wall-section').scrollIntoView({behavior:'smooth'});
  track('ver_corrente');
});

async function sendLead(email,firstName='Amigo(a)'){
  const r=await fetch('/.netlify/functions/lead',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({firstName,email,consent:true})
  });
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||'Não foi possível concluir agora.');
  return j;
}

function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
const STORAGE_KEY='deusSabePrayerNamesV1';
function getLocalNames(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]').filter(x=>x&&x.name).slice(0,20)}catch{return []}
}
function saveLocalNames(items){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items.slice(0,20)))}catch{}
}
function addLocalName(name){
  const clean=String(name||'').trim().slice(0,40);
  if(!clean)return;
  const items=getLocalNames();
  items.unshift({name:clean,at:Date.now()});
  saveLocalNames(items);
  renderLocalFeed(true);
}
function renderLocalFeed(highlight=false){
  const wall=$('#prayerWall');
  const items=getLocalNames();
  const count=$('#localCount');
  if(count)count.textContent=`${items.length} ${items.length===1?'nome':'nomes'}`;
  if(!items.length){wall.innerHTML='<div class="wall-empty">Seja o primeiro nome desta corrente. 🙏</div>';return;}
  wall.innerHTML=items.map((x,i)=>`<div class="live-name ${highlight&&i===0?'new-name':''}"><span class="avatar-prayer">🙏</span><div><strong>${escapeHtml(x.name)}</strong><small>entrou na corrente ${i===0?'agora':'recentemente'}</small></div><span class="live-badge">DEUS SABE</span></div>`).join('');
}

$('#prayerForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const st=$('#prayerStatus');
  if(!selectedCause){st.textContent='Escolha primeiro uma causa.';return}
  const name=$('#prayerName').value.trim(),email=$('#prayerEmail').value.trim();
  st.textContent='Colocando seu nome na corrente...';
  try{
    await sendLead(email,name);
    addLocalName(name);
    st.innerHTML=`🙏 <strong>${escapeHtml(name)}, seu nome entrou na corrente.</strong><br>Estamos juntos em oração. Deus sabe.`;
    track('pedido_de_oracao',{tipo:selectedCause});
    setTimeout(()=>$('.wall-section').scrollIntoView({behavior:'smooth'}),700);
  }catch(err){st.textContent=err.message}
});

$('#desabafoForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const st=$('#formStatus');st.textContent='Enviando...';
  try{
    await sendLead($('#desabafoEmail').value,'Amigo(a)');
    st.innerHTML='🙏 <strong>Recebemos seu pedido.</strong> Estamos juntos em oração. Você receberá nossas mensagens de acolhimento no e-mail informado.';
    track('desabafo_enviado');$('#desabafoTexto').value='';
    setTimeout(()=>$('#share').scrollIntoView({behavior:'smooth'}),900)
  }catch(err){st.textContent=err.message}
});

$('#emailForm').addEventListener('submit',async e=>{
  e.preventDefault();const st=$('#emailStatus');st.textContent='Cadastrando...';
  try{await sendLead($('#emailOnly').value,'Amigo(a)');st.textContent='🙏 Pronto. Vamos continuar juntos nesta corrente.';track('email_cadastrado')}
  catch(err){st.textContent=err.message}
});
$('#copyBtn').addEventListener('click',async()=>{await navigator.clipboard.writeText(SHARE_TEXT+shareUrl());$('#copyBtn').textContent='✓ LINK COPIADO';track('compartilhar_copiar')});
$('#pixCopy').addEventListener('click',async()=>{await navigator.clipboard.writeText('81996867010');$('#pixCopy').textContent='✓ PIX COPIADO';track('pix_copiado')});
$('#whatsappShare').addEventListener('click',()=>track('compartilhar_whatsapp'));
setupShare();
renderLocalFeed();
