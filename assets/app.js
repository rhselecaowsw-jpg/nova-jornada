
const $=id=>document.getElementById(id);
const val=id=>$(id)?.value?.trim()||'';
const esc=s=>(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const access=localStorage.getItem('rp_access')==='approved';
$(access?'app':'locked').classList.remove('hidden');
$('logout').onclick=()=>{localStorage.removeItem('rp_access');location.reload()};

document.querySelectorAll('.menu button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.menu button').forEach(x=>x.classList.remove('active'));
 document.querySelectorAll('.tool').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');$(b.dataset.tool).classList.add('active');window.scrollTo(0,0);
});

let step=0, template='moderno', photoData='';
const steps=[...document.querySelectorAll('.step')], progress=[...document.querySelectorAll('#progress span')];
function showStep(n){
 step=Math.max(0,Math.min(steps.length-1,n));
 steps.forEach((s,i)=>s.classList.toggle('active',i===step));
 progress.forEach((p,i)=>p.classList.toggle('active',i===step));
 $('prevStep').style.visibility=step===0?'hidden':'visible';
 $('nextStep').style.display=step===steps.length-1?'none':'inline-flex';
}
$('prevStep').onclick=()=>showStep(step-1);$('nextStep').onclick=()=>showStep(step+1);showStep(0);

document.querySelectorAll('textarea[maxlength]').forEach(t=>{
 const update=()=>{const el=document.querySelector(`[data-count="${t.id}"]`);if(el)el.textContent=t.value.length};
 t.addEventListener('input',update);update();
});

$('cvFoto').addEventListener('change',e=>{
 const f=e.target.files[0]; if(!f)return;
 if(f.size>2_500_000){alert('Escolha uma foto com até 2,5 MB.');return}
 const r=new FileReader();r.onload=()=>{photoData=r.result;$('photoPreview').innerHTML=`<img src="${photoData}" alt="Foto">`};r.readAsDataURL(f);
});
$('removePhoto').onclick=()=>{photoData='';$('cvFoto').value='';$('photoPreview').textContent='Sem foto'};

function itemTemplate(type,index){
 if(type==='exp')return `<button type="button" class="btn btn-danger btn-small remove-row">Excluir</button>
 <div class="form-grid">
 <div class="field"><label>Empresa ou atividade</label><div class="help">Ex.: Loja X, trabalho autônomo ou projeto escolar.</div><input data-k="empresa"></div>
 <div class="field"><label>Cargo ou função</label><input data-k="cargo"></div>
 <div class="field"><label>Data inicial</label><input data-k="inicio" placeholder="Mês/ano"></div>
 <div class="field"><label>Data final</label><input data-k="fim" placeholder="Mês/ano ou Atual"></div>
 <div class="field full"><label>Atividades e resultados</label><div class="help">Use frases curtas iniciadas por verbos: organizei, atendi, controlei, apoiei.</div><textarea data-k="atividades"></textarea></div>
 </div>`;
 if(type==='edu')return `<button type="button" class="btn btn-danger btn-small remove-row">Excluir</button>
 <div class="form-grid">
 <div class="field"><label>Curso ou escolaridade</label><input data-k="curso"></div>
 <div class="field"><label>Instituição</label><input data-k="instituicao"></div>
 <div class="field"><label>Situação</label><select data-k="situacao"><option>Concluído</option><option>Em andamento</option><option>Trancado</option></select></div>
 <div class="field"><label>Conclusão ou previsão</label><input data-k="conclusao" placeholder="Ano"></div>
 </div>`;
 return `<button type="button" class="btn btn-danger btn-small remove-row">Excluir</button>
 <div class="form-grid">
 <div class="field"><label>Nome do curso</label><input data-k="nome"></div>
 <div class="field"><label>Instituição</label><input data-k="instituicao"></div>
 <div class="field"><label>Carga horária</label><input data-k="carga" placeholder="Ex.: 20 horas"></div>
 <div class="field"><label>Ano</label><input data-k="ano"></div>
 </div>`;
}
function addItem(container,type,data={}){
 const d=document.createElement('div');d.className='dynamic-item';d.innerHTML=itemTemplate(type);
 d.querySelectorAll('[data-k]').forEach(el=>{if(data[el.dataset.k]!=null)el.value=data[el.dataset.k]});
 d.querySelector('.remove-row').onclick=()=>d.remove();$(container).appendChild(d);
}
$('addExperience').onclick=()=>addItem('experiences','exp');
$('addEducation').onclick=()=>addItem('education','edu');
$('addCourse').onclick=()=>addItem('courses','course');
addItem('experiences','exp');addItem('education','edu');addItem('courses','course');

function collect(container){
 return [...$(container).querySelectorAll('.dynamic-item')].map(item=>{
  const o={};item.querySelectorAll('[data-k]').forEach(el=>o[el.dataset.k]=el.value.trim());return o;
 }).filter(o=>Object.values(o).some(Boolean));
}
document.querySelectorAll('.template-option').forEach(x=>x.onclick=()=>{
 document.querySelectorAll('.template-option').forEach(y=>y.classList.remove('selected'));
 x.classList.add('selected');template=x.dataset.template;
});
$('suggestObjective').onclick=()=>{
 const skill=val('cvHabilidades').split(',')[0]?.trim()||'organização';
 $('cvObjetivo').value=`Busco uma oportunidade profissional na área desejada, na qual eu possa contribuir com ${skill}, responsabilidade e disposição para aprender.`;
 $('cvObjetivo').dispatchEvent(new Event('input'));
};
$('suggestSummary').onclick=()=>{
 const skills=val('cvHabilidades')||'responsabilidade, organização e vontade de aprender';
 $('cvResumo').value=`Profissional com perfil comprometido, destacando-se por ${skills}. Possui facilidade para aprender, seguir orientações e contribuir com a rotina da equipe.`;
 $('cvResumo').dispatchEvent(new Event('input'));
};

function bullets(arr,fn){
 if(!arr.length)return '';
 return '<ul>'+arr.map(x=>`<li>${fn(x)}</li>`).join('')+'</ul>';
}
function createCV(){
 const exps=collect('experiences'), edus=collect('education'), courses=collect('courses');
 const meta=[val('cvTelefone'),val('cvEmail'),val('cvCidade'),val('cvLinkedin')].filter(Boolean).join(' | ');
 const showPhoto=photoData && template!=='ats';
 const head=`<div class="cv-header">${showPhoto?`<img class="cv-photo" src="${photoData}" alt="Foto">`:''}<div><h1>${esc(val('cvNome')||'SEU NOME')}</h1><div class="cv-meta">${esc(meta)}</div></div></div>`;
 let html=head;
 if(val('cvObjetivo'))html+=`<h2>Objetivo profissional</h2><p>${esc(val('cvObjetivo'))}</p>`;
 if(val('cvResumo'))html+=`<h2>Resumo profissional</h2><p>${esc(val('cvResumo'))}</p>`;
 if(exps.length)html+=`<h2>Experiência profissional</h2>${exps.map(x=>`<div><strong>${esc(x.cargo||x.empresa)}</strong>${x.empresa?` — ${esc(x.empresa)}`:''}<div class="cv-meta">${esc([x.inicio,x.fim].filter(Boolean).join(' a '))}</div>${x.atividades?`<p>${esc(x.atividades).replace(/\n/g,'<br>')}</p>`:''}</div>`).join('')}`;
 if(edus.length)html+=`<h2>Formação acadêmica</h2>${bullets(edus,x=>`${esc(x.curso)}${x.instituicao?' — '+esc(x.instituicao):''}${x.situacao?' — '+esc(x.situacao):''}${x.conclusao?' ('+esc(x.conclusao)+')':''}`)}`;
 if(courses.length)html+=`<h2>Cursos e certificações</h2>${bullets(courses,x=>`${esc(x.nome)}${x.instituicao?' — '+esc(x.instituicao):''}${x.carga?' — '+esc(x.carga):''}${x.ano?' ('+esc(x.ano)+')':''}`)}`;
 const hab=val('cvHabilidades').split(',').map(x=>x.trim()).filter(Boolean);
 if(hab.length)html+=`<h2>Habilidades</h2>${bullets(hab,esc)}`;
 if(val('cvIdiomas'))html+=`<h2>Idiomas</h2><p>${esc(val('cvIdiomas'))}</p>`;
 if(val('cvAdicionais'))html+=`<h2>Informações adicionais</h2><p>${esc(val('cvAdicionais')).replace(/\n/g,'<br>')}</p>`;
 const p=$('cvPreview');p.className='cv-preview '+template;p.innerHTML=html;
}
$('generateCv').onclick=createCV;$('printCv').onclick=()=>{createCV();window.print()};

function snapshot(){
 return {
  simple:['cvNome','cvTelefone','cvEmail','cvCidade','cvLinkedin','cvObjetivo','cvResumo','cvHabilidades','cvIdiomas','cvAdicionais'].reduce((o,id)=>(o[id]=val(id),o),{}),
  exps:collect('experiences'),edus:collect('education'),courses:collect('courses'),template,photoData
 };
}
$('saveCv').onclick=()=>{localStorage.setItem('rp_cv_v2',JSON.stringify(snapshot()));alert('Dados salvos neste navegador.')};
try{
 const d=JSON.parse(localStorage.getItem('rp_cv_v2'));
 if(d){
  Object.entries(d.simple||{}).forEach(([k,v])=>{if($(k)){$(k).value=v;$(k).dispatchEvent(new Event('input'))}});
  ['experiences','education','courses'].forEach(id=>$(id).innerHTML='');
  (d.exps||[]).forEach(x=>addItem('experiences','exp',x));(d.edus||[]).forEach(x=>addItem('education','edu',x));(d.courses||[]).forEach(x=>addItem('courses','course',x));
  if(!(d.exps||[]).length)addItem('experiences','exp');if(!(d.edus||[]).length)addItem('education','edu');if(!(d.courses||[]).length)addItem('courses','course');
  template=d.template||'moderno';photoData=d.photoData||'';
  if(photoData)$('photoPreview').innerHTML=`<img src="${photoData}" alt="Foto">`;
  document.querySelectorAll('.template-option').forEach(x=>x.classList.toggle('selected',x.dataset.template===template));
 }
}catch(e){}

$('genTextos').onclick=()=>{
 const cargo=val('txCargo')||'área desejada', nivel=val('txNivel'), qual=val('txQualidades')||'responsabilidade, organização e vontade de aprender', con=val('txConhecimentos')||'conhecimentos compatíveis com a função';
 $('resObjetivo').textContent=nivel==='Mudança de carreira'?`Busco uma oportunidade na área de ${cargo}, aplicando competências transferíveis e desenvolvendo novos conhecimentos.`:`Busco oportunidade como ${cargo}, com o objetivo de desenvolver minhas habilidades e contribuir para a equipe.`;
 $('resResumo').textContent=`Profissional com perfil ${qual}, interessado em atuar como ${cargo}. Possui ${con} e demonstra comprometimento, facilidade para aprender e disposição para contribuir.`;
};
$('genCandidatura').onclick=()=>{
 const n=val('caNome')||'[SEU NOME]',e=val('caEmpresa')||'[EMPRESA]',v=val('caVaga')||'[VAGA]',q=val('caQualidades')||'responsabilidade e vontade de aprender',s=val('caSituacao');
 const exp=s==='Primeiro emprego'?'Estou em busca da minha primeira oportunidade profissional':'Tenho interesse em uma nova oportunidade profissional';
 $('resCarta').textContent=`Prezados(as) responsáveis pelo recrutamento da ${e},\n\nMeu nome é ${n} e gostaria de me candidatar à vaga de ${v}. ${exp} e acredito que meu perfil, marcado por ${q}, pode contribuir com a equipe.\n\nFico à disposição para entrevista.\n\nAtenciosamente,\n${n}`;
 $('resWhatsapp').textContent=`Olá! Meu nome é ${n}. Vi a vaga de ${v} na ${e} e gostaria de participar do processo seletivo. Destaco ${q}. Estou enviando meu currículo e fico à disposição.`;
 $('resEmail').textContent=`Assunto: Candidatura — ${v} — ${n}\n\nOlá,\n\nGostaria de me candidatar à vaga de ${v} na ${e}. ${exp} e acredito que ${q} podem contribuir com a função.\n\nSegue meu currículo.\n\nAtenciosamente,\n${n}`;
};
const qs=['Fale sobre você.','Por que deseja esta função?','Quais são seus pontos fortes?','Conte uma situação em que aprendeu algo rapidamente.','Como reage a críticas?','Por que devemos escolher você?'];
$('startInterview').onclick=()=>{
 const vaga=val('intVaga')||'esta vaga';
 $('questions').innerHTML=qs.map((q,i)=>`<div class="question"><strong>${i+1}. ${q}</strong><div class="help">Responda pensando na vaga de ${esc(vaga)} e use exemplos reais.</div><textarea id="ans${i}"></textarea></div>`).join('')+'<button class="btn btn-primary" id="evaluate">Avaliar respostas</button>';
 $('scoreBox').classList.add('hidden');
 $('evaluate').onclick=()=>{let score=0;qs.forEach((_,i)=>{const a=val('ans'+i);score+=a.length>=80?16:a.length>=35?10:a.length?5:0});score=Math.min(100,score+4);$('score').textContent=score+'/100';$('feedback').textContent=score<50?'Inclua exemplos concretos e explique melhor suas ações.':score<75?'Boa base. Desenvolva situação, ação e resultado.':'Boa estrutura. Agora pratique em voz alta.';$('scoreBox').classList.remove('hidden')};
};
$('genPlano').onclick=()=>{
 const c=val('plCargo')||'área desejada',h=val('plHoras'),d=val('plDificuldade');
 const p=[`Dia 1 — Defina seu foco em ${c}.`,`Dia 2 — Crie ou revise seu currículo.`,`Dia 3 — Cadastre-se em sites e liste empresas.`,`Dia 4 — Faça candidaturas durante ${h}.`,`Dia 5 — Treine entrevistas.`,`Dia 6 — Envie mensagens profissionais.`,`Dia 7 — Revise resultados e planeje a próxima semana.`];
 const extra=d==='Não encontro vagas'?'Priorize empresas locais, agências e alertas.':d==='Tenho medo de entrevista'?'Repita o simulador e grave suas respostas.':d==='Envio currículos e não recebo resposta'?'Revise palavras-chave e adapte o currículo.':'Comece preenchendo seu currículo.';
 $('resPlano').textContent=p.join('\n\n')+'\n\nAtenção especial: '+extra;
};


// Personalização vinda do diagnóstico
try{
  const diagnostic=JSON.parse(localStorage.getItem('rp_diagnostic_result')||'null');
  if(diagnostic && document.getElementById('premiumWelcome')){
    const map={
      curriculo:'Seu diagnóstico indicou que o currículo é o ponto principal. Comece pelo Criador de Currículo Profissional.',
      entrevista:'Seu diagnóstico indicou dificuldade em entrevistas. Crie seu currículo e depois use o Simulador de Entrevista.',
      direcao:'Seu diagnóstico indicou falta de direção. Comece pelo Plano de 7 Dias e depois prepare seu currículo.',
      qualificacao:'Seu diagnóstico indicou necessidade de qualificação. Organize seu perfil e use o plano para definir os próximos passos.',
      experiencia:'Seu diagnóstico indicou falta de experiência. O currículo pode destacar cursos, projetos, habilidades e atividades informais.'
    };
    document.getElementById('premiumWelcome').textContent=map[diagnostic.difficulty]||'Use as ferramentas recomendadas para fortalecer sua candidatura.';
  }
}catch(e){}
