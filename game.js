// Limpando a tela antiga
document.body.innerHTML = "";

// Criando a caixinha do jogo
let jogo = document.createElement("div");
jogo.style.padding = "20px";
jogo.style.fontFamily = "sans-serif";
jogo.style.fontSize = "18px";
jogo.style.lineHeight = "1.6";
document.body.appendChild(jogo);

let pistaEncontrada = "";

// Função para desenhar a história na tela
function iniciarJogo() {
  jogo.innerHTML = `
    <h2>🕵️‍♂️ CASO: O SUMIÇO DO RELÓGIO DE OURO 🕵️‍♂️</h2>
    <p>O Coronel Neto está desesperado! O relógio de bolso da família sumiu.</p>
    <p><b>Passo 1: Quem você deseja interrogar primeiro?</b></p>
    <button onclick="interrogar('Seu Zé')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Seu Zé (O Caseiro)</button>
    <button onclick="interrogar('Padre')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Padre (Da Igrejinha)</button>
    <button onclick="interrogar('Dona Maria')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Dona Maria (A Benzedeira)</button>
  `;
}

// Função quando clica no suspeito
window.interrogar = function(suspeito) {
  let textoSuspeito = "";
  
  if (suspeito === "Seu Zé") {
    textoSuspeito = "<b>Seu Zé:</b> 'Cuidando das vacas, moço... Mas confesso que andei perto do casarão.'<br>🔍 <b>[PISTA]:</b> Você achou uma pegada de bota de lama perto da janela!";
    pistaEncontrada = "lama";
  } else if (suspeito === "Padre") {
    textoSuspeito = "<b>Padre:</b> 'Ontem à noite eu estava rezando sozinho... mas ouvi passos no canavial.'<br>🔍 <b>[PISTA]:</b> Você achou um bilhete rasgado perto do altar!";
    pistaEncontrada = "bilhete";
  } else if (suspeito === "Dona Maria") {
    textoSuspeito = "<b>Dona Maria:</b> 'Eu vi uma luz estranha brilhando perto do moinho abandonado tarde da noite!'<br>🔍 <b>[PISTA]:</b> Você achou um pedaço de tecido preso na cerca!";
    pistaEncontrada = "tecido";
  }

  jogo.innerHTML = `
    <h2>🕵️‍♂️ INVESTIGAÇÃO em andamento...</h2>
    <p>Você interrogou o <b>${suspeito}</b>.</p>
    <p>${textoSuspeito}</p>
    <hr>
    <p><b>Passo 2: O tempo acabou! Quem é o culpado?</b></p>
    <button onclick="acusar('Seu Zé')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; cursor:pointer;">Acusar Seu Zé</button>
    <button onclick="acusar('Padre')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; cursor:pointer;">Acusar Padre</button>
    <button onclick="acusar('Dona Maria')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; cursor:pointer;">Acusar Dona Maria</button>
  `;
}

// Função do veredito final
window.acusar = function(suspeitoAcusado) {
  if (suspeitoAcusado === "Seu Zé") {
    jogo.innerHTML = `
      <h2 style='color: green;'>🎉 PARABÉNS, DETETIVE! Você acertou!</h2>
      <p>As botas do Seu Zé combinavam perfeitamente com a pegada de lama na janela. O relógio estava escondido no celeiro dele!</p>
      <button onclick="iniciarJogo()" style="padding:10px; font-size:16px; cursor:pointer;">Jogar Novamente</button>
    `;
  } else {
    jogo.innerHTML = `
      <h2 style='color: red;'>❌ VOCÊ ERROU O PALPITE!</h2>
      <p>Você acusou o(a) <b>${suspeitoAcusado}</b>, mas ele(a) tinha um álibi perfeito. O verdadeiro culpado fugiu com o relógio do Coronel!</p>
      <button onclick="iniciarJogo()" style="padding:10px; font-size:16px; cursor:pointer;">Tentar Novamente</button>
    `;
  }
}

// Inicia o jogo na tela
iniciarJogo();