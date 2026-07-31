(function(){
 const data=JSON.parse(localStorage.getItem('rp_diagnostic_result')||'null');
 const defaults={badge:'Plano profissional',title:'Seu plano personalizado está pronto.',summary:'Organize sua apresentação profissional e avance uma etapa por vez.',analysis:'Você pode começar fortalecendo seu currículo, sua comunicação e sua rotina de candidaturas.',steps:['Defina o tipo de oportunidade que deseja buscar.','Crie ou atualize seu currículo.','Prepare uma apresentação curta sobre você.','Reserve horários fixos para procurar vagas.','Treine respostas para entrevistas.']};
 const r=data||defaults;
 document.getElementById('planBadge').textContent=r.badge||defaults.badge;
 document.getElementById('planTitle').textContent=r.title||defaults.title;
 document.getElementById('planSummary').textContent=r.summary||defaults.summary;
 const difficulty=r.difficulty||'';
 const analyses={curriculo:'Seu principal ponto de atenção é a apresentação profissional. Um currículo mais claro, direcionado e fácil de ler pode aumentar suas chances de entrevista.',entrevista:'Seu principal ponto de atenção é a preparação para entrevistas. Treinar exemplos reais e respostas objetivas pode aumentar sua confiança.',direcao:'Seu principal ponto de atenção é a direção profissional. Definir um alvo realista evita esforços dispersos.',qualificacao:'Seu principal ponto de atenção é a qualificação. Priorize competências realmente exigidas nas vagas que deseja.',experiencia:'Mesmo com pouca experiência, você pode destacar cursos, projetos, atividades informais, habilidades e disposição para aprender.'};
 document.getElementById('planAnalysis').textContent=analyses[difficulty]||r.analysis||defaults.analysis;
 const steps=(r.steps&&r.steps.length?r.steps:defaults.steps); const list=document.getElementById('planSteps');
 steps.forEach((s,i)=>{const li=document.createElement('li');li.innerHTML='<strong>Passo '+(i+1)+'</strong><span>'+s+'</span>';list.appendChild(li)});
})();
