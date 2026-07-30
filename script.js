const CONFIG = {
  // Troque pelos seus links reais antes de publicar.
  instagram: "https://www.instagram.com/nova.jornada.oficial/",
  whatsapp: "https://wa.me/5581996867010?text=Ol%C3%A1%2C%20vim%20pela%20plataforma%20Nova%20Jornada%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.",
  produtoPago: "oferta.html"
};

const profiles = [
  ["primeiro_emprego","🌱","Estou procurando meu primeiro emprego","Nunca trabalhei ou ainda não consegui minha primeira oportunidade."],
  ["emprego_melhor","📈","Quero conquistar um emprego melhor","Já trabalho ou já trabalhei, mas quero uma oportunidade melhor."],
  ["mudar_profissao","🔄","Quero mudar de profissão","Desejo iniciar uma nova carreira ou atuar em outra área."],
  ["crescer_carreira","🚀","Quero crescer na minha carreira","Quero desenvolver minhas habilidades e alcançar novos objetivos."],
  ["indeciso","🧭","Ainda não sei qual caminho seguir","Preciso de ajuda para descobrir a melhor direção profissional."]
];

const questions = [
  {
    id:"objetivo",
    title:"Qual é o seu maior objetivo neste momento?",
    help:"Escolha a opção que mais combina com o que você busca agora.",
    options:[
      ["primeiro","🌱","Conseguir meu primeiro emprego","Entrar no mercado de trabalho."],
      ["melhor","📈","Conseguir um emprego melhor","Buscar uma oportunidade mais interessante."],
      ["mudar","🔄","Mudar de profissão","Começar uma nova área ou carreira."],
      ["crescer","🚀","Crescer na minha carreira","Evoluir onde já atuo."],
      ["descobrir","🧭","Descobrir meu caminho","Entender qual direção seguir."]
    ]
  },
  {
    id:"dificuldade",
    title:"O que mais está dificultando sua evolução profissional?",
    help:"Não existe resposta certa. Escolha sua maior dificuldade hoje.",
    options:[
      ["experiencia","🧩","Falta de experiência","Ainda não tive oportunidades suficientes."],
      ["curriculo","📄","Meu currículo não gera entrevistas","Envio currículos, mas não sou chamado."],
      ["direcao","🧭","Não sei por onde começar","Tenho vontade, mas falta clareza."],
      ["qualificacao","🎓","Falta de qualificação","Preciso desenvolver conhecimentos ou habilidades."],
      ["entrevista","💬","Falta de confiança nas entrevistas","Tenho dificuldade em me apresentar."],
      ["outro","➕","Outro desafio","Minha dificuldade não está nas opções acima."]
    ]
  },
  {
    id:"situacao",
    title:"Qual frase melhor descreve sua situação atual?",
    help:"Isso nos ajuda a entender o momento da sua jornada.",
    options:[
      ["nunca_trabalhei","🌱","Nunca trabalhei","Estou buscando minha primeira oportunidade."],
      ["desempregado","🔎","Estou desempregado","Quero voltar ao mercado de trabalho."],
      ["empregado_mudar","💼","Estou empregado, mas quero mudar","Busco outra empresa, área ou função."],
      ["empregado_crescer","📈","Estou empregado e quero crescer","Quero avançar profissionalmente."]
    ]
  },
  {
    id:"prazo",
    title:"Em quanto tempo você gostaria de alcançar seu objetivo?",
    help:"O prazo ajuda a definir a intensidade dos próximos passos.",
    options:[
      ["urgente","⚡","O mais rápido possível","Minha necessidade é urgente."],
      ["3_meses","📅","Nos próximos 3 meses","Quero avançar em curto prazo."],
      ["6_meses","🗓️","Nos próximos 6 meses","Tenho tempo para me preparar."],
      ["sem_prazo","🌤️","Ainda não tenho prazo definido","Quero começar com calma."]
    ]
  },
  {
    id:"tempo",
    title:"Quanto tempo por semana você consegue dedicar ao seu desenvolvimento profissional?",
    help:"Considere o tempo disponível para currículos, estudos, vagas e preparação.",
    options:[
      ["menos_2","⏱️","Menos de 2 horas","Preciso de um plano bem objetivo."],
      ["2_5","🕒","Entre 2 e 5 horas","Consigo manter uma rotina leve."],
      ["5_10","📚","Entre 5 e 10 horas","Tenho boa disponibilidade."],
      ["mais_10","🔥","Mais de 10 horas","Posso acelerar minha evolução."]
    ]
  }
];

const state={profile:null,answers:{},questionIndex:0};

const screens={
  home:document.getElementById("screen-home"),
  profile:document.getElementById("screen-profile"),
  question:document.getElementById("screen-question"),
  loading:document.getElementById("screen-loading"),
  result:document.getElementById("screen-result"),
  support:document.getElementById("screen-support"),
  next:document.getElementById("screen-next")
};

const profileOptions=document.getElementById("profileOptions");
const questionOptions=document.getElementById("questionOptions");
const questionTitle=document.getElementById("questionTitle");
const questionHelp=document.getElementById("questionHelp");
const questionStep=document.getElementById("questionStep");
const progressWrap=document.getElementById("progressWrap");
const progressText=document.getElementById("progressText");
const progressValue=document.getElementById("progressValue");
const progressBar=document.getElementById("progressBar");

function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove("active"));
  screens[name].classList.add("active");
  const showProgress=name==="question";
  progressWrap.classList.toggle("hidden",!showProgress);
  window.scrollTo({top:0,behavior:"smooth"});
}

function optionButton(icon,title,description,onClick){
  const b=document.createElement("button");
  b.type="button";b.className="option-btn";
  b.innerHTML=`<span class="option-icon">${icon}</span>
  <span class="option-copy"><strong>${title}</strong><span>${description}</span></span>
  <span class="option-arrow">›</span>`;
  b.addEventListener("click",onClick);
  return b;
}

function renderProfiles(){
  profileOptions.innerHTML="";
  profiles.forEach(([id,icon,title,description])=>{
    profileOptions.appendChild(optionButton(icon,title,description,()=>{
      state.profile=id;state.questionIndex=0;renderQuestion();showScreen("question");
    }));
  });
}

function renderQuestion(){
  const q=questions[state.questionIndex];
  questionTitle.textContent=q.title;
  questionHelp.textContent=q.help;
  questionStep.textContent=`PERGUNTA ${state.questionIndex+1} DE ${questions.length}`;
  questionOptions.innerHTML="";

  const percent=Math.round(((state.questionIndex+1)/questions.length)*100);
  const messages=[
    "Construindo seu perfil profissional...",
    "Analisando seus objetivos...",
    "Identificando suas oportunidades...",
    "Preparando seu diagnóstico...",
    "Seu plano profissional está quase pronto..."
  ];
  progressText.textContent=messages[state.questionIndex];
  progressValue.textContent=`${percent}%`;
  progressBar.style.width=`${percent}%`;

  q.options.forEach(([value,icon,title,description])=>{
    questionOptions.appendChild(optionButton(icon,title,description,()=>{
      state.answers[q.id]=value;
      if(state.questionIndex<questions.length-1){
        state.questionIndex++;renderQuestion();
      }else{
        showScreen("loading");
        setTimeout(()=>{renderResult(calculateResult());showScreen("result");},900);
      }
    }));
  });
}

function calculateResult(){
  const firstJob=state.profile==="primeiro_emprego"||state.answers.objetivo==="primeiro"||state.answers.situacao==="nunca_trabalhei";
  const careerChange=state.profile==="mudar_profissao"||state.answers.objetivo==="mudar";
  const growth=state.profile==="crescer_carreira"||state.answers.objetivo==="crescer"||state.answers.situacao==="empregado_crescer";
  const indecisive=state.profile==="indeciso"||state.answers.objetivo==="descobrir"||state.answers.dificuldade==="direcao";
  const urgent=state.answers.prazo==="urgente";
  const resumeProblem=state.answers.dificuldade==="curriculo";
  const interviewProblem=state.answers.dificuldade==="entrevista";
  const lowTime=state.answers.tempo==="menos_2";

  if(firstJob){
    return{
      badge:"Início de carreira",
      title:"Seu caminho recomendado: preparar sua entrada no mercado",
      summary:"Você está iniciando sua jornada profissional e precisa transformar seu potencial em uma apresentação clara para as empresas.",
      analysis:urgent
        ?"Como sua necessidade é urgente, o melhor caminho é agir com foco: preparar uma apresentação profissional, candidatar-se com frequência e acompanhar oportunidades todos os dias."
        :"Seu momento pede uma base bem construída: uma boa apresentação profissional, busca constante por vagas e preparação para processos seletivos.",
      steps:[
        "Criar ou revisar seu currículo para destacar estudos, cursos, habilidades e objetivos.",
        "Candidatar-se regularmente a vagas compatíveis com seu perfil.",
        interviewProblem?"Treinar respostas para entrevistas e aprender a apresentar seus pontos fortes.":"Preparar uma apresentação curta sobre quem você é e o que busca.",
        lowTime?"Reservar pelo menos 20 minutos por dia para procurar vagas.":"Criar uma rotina semanal de busca por oportunidades."
      ]
    };
  }

  if(careerChange){
    return{
      badge:"Transição de carreira",
      title:"Seu caminho recomendado: fazer uma transição profissional planejada",
      summary:"Você deseja iniciar uma nova fase e precisa apresentar sua experiência de forma alinhada à área que pretende conquistar.",
      analysis:"Sua experiência anterior não deve ser descartada. O ponto central é traduzir suas competências para a nova área e construir uma mudança gradual, com direção e segurança.",
      steps:[
        "Definir com clareza a área ou função que deseja alcançar.",
        "Adaptar seu currículo para destacar competências transferíveis.",
        "Pesquisar vagas reais e identificar as exigências mais frequentes.",
        "Criar um plano de qualificação focado apenas no que o mercado pede."
      ]
    };
  }

  if(growth){
    return{
      badge:"Crescimento profissional",
      title:"Seu caminho recomendado: transformar experiência em avanço",
      summary:"Você já possui uma base profissional e agora precisa direcionar seus esforços para alcançar um novo nível.",
      analysis:"Seu próximo passo depende de posicionamento. É importante demonstrar resultados, fortalecer competências valorizadas e buscar oportunidades compatíveis com o crescimento desejado.",
      steps:[
        "Atualizar o currículo com resultados e responsabilidades relevantes.",
        "Escolher uma competência estratégica para desenvolver.",
        "Buscar vagas, promoções ou projetos que aproximem você do próximo nível.",
        interviewProblem?"Treinar sua comunicação para entrevistas e conversas profissionais.":"Organizar exemplos concretos de resultados que você já alcançou."
      ]
    };
  }

  if(indecisive){
    return{
      badge:"Descoberta profissional",
      title:"Seu caminho recomendado: ganhar clareza antes de decidir",
      summary:"Você deseja evoluir, mas ainda precisa entender qual direção combina melhor com seu momento, suas habilidades e seus objetivos.",
      analysis:"Não saber o caminho agora não significa falta de capacidade. Antes de tomar uma decisão grande, vale organizar suas experiências, interesses e necessidades para escolher com mais segurança.",
      steps:[
        "Listar atividades que você faz bem e experiências das quais se orgulha.",
        "Identificar o que deseja mudar em sua situação atual.",
        "Pesquisar três possibilidades profissionais realistas.",
        "Escolher uma pequena ação para testar cada possibilidade."
      ]
    };
  }

  return{
    badge:"Nova oportunidade",
    title:"Seu caminho recomendado: reposicionar-se para conquistar uma vaga melhor",
    summary:"Você já possui experiência e deseja transformar essa trajetória em novas oportunidades.",
    analysis:resumeProblem
      ?"Como seu currículo não está gerando entrevistas, o principal ponto de melhoria é a forma como sua experiência está sendo apresentada às empresas."
      :"Seu momento pede foco, apresentação profissional e uma busca direcionada para vagas compatíveis com seus objetivos.",
    steps:[
      "Definir o tipo de vaga que deseja conquistar.",
      "Atualizar o currículo com foco nas exigências dessas vagas.",
      "Candidatar-se com constância e acompanhar os processos.",
      "Preparar exemplos de experiências e resultados para entrevistas."
    ]
  };
}

function renderResult(result){
  localStorage.setItem("rp_diagnostic_result", JSON.stringify({
    badge: result.badge,
    title: result.title,
    summary: result.summary,
    difficulty: state.answers.dificuldade || "",
    profile: state.profile || ""
  }));
  document.getElementById("resultBadge").textContent=result.badge;
  document.getElementById("resultTitle").textContent=result.title;
  document.getElementById("resultSummary").textContent=result.summary;
  document.getElementById("resultAnalysis").textContent=result.analysis;
  const list=document.getElementById("resultSteps");
  list.innerHTML="";
  result.steps.forEach(step=>{
    const li=document.createElement("li");li.textContent=step;list.appendChild(li);
  });
}

function resetApp(){
  state.profile=null;state.answers={};state.questionIndex=0;showScreen("home");
}

document.addEventListener("click",e=>{
  const action=e.target.closest("[data-action]")?.dataset.action;
  if(!action)return;

  if(action==="start")showScreen("profile");
  if(action==="back"){
    if(state.questionIndex>0){state.questionIndex--;renderQuestion();}
    else showScreen("profile");
  }
  if(action==="first-step")showScreen("support");
  if(action==="back-result")showScreen("result");
  if(action==="continue-after-support")showScreen("next");
  if(action==="back-support")showScreen("support");
  if(action==="restart")resetApp();
});

document.getElementById("nextProdutos").href=CONFIG.produtoPago;
document.getElementById("nextInstagram").href=CONFIG.instagram;
document.getElementById("resultInstagram").href=CONFIG.instagram;
document.getElementById("nextWhatsapp").href=CONFIG.whatsapp;
document.getElementById("floatingWhatsapp").href=CONFIG.whatsapp;
document.getElementById("year").textContent=new Date().getFullYear();

renderProfiles();
