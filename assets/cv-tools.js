(() => {
"use strict";
const $=id=>document.getElementById(id);
const val=id=>$(id)?.value?.trim()||'';
const esc=s=>(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
})();
