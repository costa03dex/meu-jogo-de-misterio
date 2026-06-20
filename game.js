// Limpando a tela antiga
document.body.innerHTML = "";

// Criando a caixinha do jogo
let jogo = document.createElement("div");
jogo.style.padding = "20px";
jogo.style.fontFamily = "sans-serif";
jogo.style.fontSize = "18px";
jogo.style.lineHeight = "1.6";
document.body.appendChild(jogo);

// Variáveis do Jogo
let pistasEncontradas = 0;
let vidaJogador = 3;
let pegouEspingarda = false;
let informacaoEspecial = false;

let suspeitosInvestigados = {
  "Seu Zé": false,
  "Padre": false,
  "Dona Maria": false,
  "Cangaceiro": false
};

// Tela Inicial do Jogo
function mostrarPainelInvestigacao() {
  jogo.innerHTML = `
    <h2>🕵️‍♂️ CASO: O SUMIÇO DO RELÓGIO DE OURO 🕵️‍♂️</h2>
    <p>O Coronel Neto está desesperado! O relógio de bolso sumiu do casarão.</p>
    <p><b>Pistas encontradas: ${pistasEncontradas} / 3</b></p>
    ${informacaoEspecial ? "<p style='color: purple;'>✨ <b>Info Especial ativa:</b> Você sabe o segredo do casarão!</p>" : ""}
    <hr>
    <h3>📍 Escolha sua ação no vilarejo:</h3>
  `;

  // Botões normais de suspeitos
  if (!suspeitosInvestigados["Seu Zé"]) {
    jogo.innerHTML += `<button onclick="interrogar('Seu Zé')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Seu Zé (O Caseiro)</button>`;
  }
  if (!suspeitosInvestigados["Padre"]) {
    jogo.innerHTML += `<button onclick="interrogar('Padre')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Padre (Da Igrejinha)</button>`;
  }
  if (!suspeitosInvestigados["Dona Maria"]) {
    jogo.innerHTML += `<button onclick="interrogar('Dona Maria')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Dona Maria</button>`;
  }

  // Botão da Missão Especial do Cangaceiro
  if (!suspeitosInvestigados["Cangaceiro"]) {
    jogo.innerHTML += `<br><br><button onclick="iniciarMissao()" style="padding:12px; margin:5px; background-color: #f0ad4e; color: black; font-weight: bold; cursor:pointer; border-radius:5px;">🔥 Falar com Tião Cangaceiro (Missão Secreta)</button>`;
  }

  // Libera acusação com 3 pistas ou com a Informação Especial!
  if (pistasEncontradas >= 3 || informacaoEspecial) {
    jogo.innerHTML += `
      <hr>
      <h3 style="color: #d9534f;">🚨 HORA DO VEREDITO FINAL:</h3>
      <button onclick="acusar('Seu Zé')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Seu Zé</button>
      <button onclick="acusar('Padre')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Padre</button>
      <button onclick="acusar('Dona Maria')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Dona Maria</button>
    `;
  }
}

// Diálogos padrão
window.interrogar = function(suspeito) {
  suspeitosInvestigados[suspeito] = true;
  let fala = "";
  let pista = "";

  if (suspeito === "Seu Zé") {
    fala = "<b>Seu Zé:</b> 'Eu estava com as vacas... mas vi marcas estranhas na janela.'";
    pista = "🔍 [PISTA]: Pegada de bota com lama perto da janela!";
    pistasEncontradas++;
  } else if (suspeito === "Padre") {
    fala = "<b>Padre:</b> 'Ouvi passos correndo em direção ao canavial ontem à noite.'";
    pista = "🔍 [PISTA]: Pedaço de corda de saco de ouro no altar!";
    pistasEncontradas++;
  } else if (suspeito === "Dona Maria") {
    fala = "<b>Dona Maria:</b> 'Vi uma sombra brilhando perto do moinho abandonado.'";
    pista = "🔍 [PISTA]: Botão de camisa luxuosa preso na cerca!";
    pistasEncontradas++;
  }

  jogo.innerHTML = `
    <h2>🕵️‍♂️ INVESTIGANDO...</h2>
    <p>${fala}</p>
    <p style="color: blue;">${pista}</p>
    <br>
    <button onclick="mostrarPainelInvestigacao()" style="padding:10px; background-color: #5cb85c; color: white; border:none; cursor:pointer;">Voltar</button>
  `;
}

// --- JORNADA DE DESAFIO (CANGACEIRO) ---
window.iniciarMissao = function() {
  jogo.innerHTML = `
    <h2>🤠 O Acordo com Tião Cangaceiro</h2>
    <p><b>Tião:</b> 'Eu invadi o casarão ontem e sei exatamente quem pegou o relógio... Mas perdi minha espingarda de estimação no canavial antigo enquanto fugia de um rival. Se você recuperá-la para mim, eu te conto tudo!'</p>
    <p>Você aceita o desafio e entra na mata escura...</p>
    <br>
    <button onclick="faseCriaturas('serpente')" style="padding:12px; background-color: #d9534f; color:white; font-weight:bold; cursor:pointer;">Avançar no Canavial 🐍</button>
  `;
}

// Sistema de Combate / Escolhas da Jornada
window.fase