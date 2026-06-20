// Limpando a tela antiga
document.body.innerHTML = "";

// Criando a caixinha do jogo
let jogo = document.createElement("div");
jogo.style.padding = "20px";
jogo.style.fontFamily = "sans-serif";
jogo.style.fontSize = "18px";
jogo.style.lineHeight = "1.6";
document.body.appendChild(jogo);

// Variaveis do Jogo
let pistasEncontradas = 0;
let vidaJogador = 3;
let informacaoEspecial = false;

let suspeitosInvestigados = {
  "Seu Ze": false,
  "Padre": false,
  "Dona Maria": false,
  "Cangaceiro": false
};

// Tela Inicial do Jogo
function mostrarPainelInvestigacao() {
  jogo.innerHTML = `
    <h2>🕵️‍♂️ CASO: O SUMICO DO RELOGIO DE OURO 🕵️‍♂️</h2>
    <p>O Coronel Neto esta desesperado! O relogio de bolso sumiu do casarao.</p>
    <p><b>Pistas encontradas: ${pistasEncontradas} / 3</b></p>
    ${informacaoEspecial ? "<p style='color: purple;'>✨ <b>Info Especial ativa:</b> Voce sabe o segredo do casarao!</p>" : ""}
    <hr>
    <h3>📍 Escolha sua acao no vilarejo:</h3>
  `;

  if (!suspeitosInvestigados["Seu Ze"]) {
    jogo.innerHTML += `<button onclick="interrogar('Seu Ze')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Seu Ze (O Caseiro)</button>`;
  }
  if (!suspeitosInvestigados["Padre"]) {
    jogo.innerHTML += `<button onclick="interrogar('Padre')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Padre (Da Igrejinha)</button>`;
  }
  if (!suspeitosInvestigados["Dona Maria"]) {
    jogo.innerHTML += `<button onclick="interrogar('Dona Maria')" style="padding:10px; margin:5px; cursor:pointer;">Interrogar Dona Maria</button>`;
  }
  if (!suspeitosInvestigados["Cangaceiro"]) {
    jogo.innerHTML += `<br><br><button onclick="iniciarMissao()" style="padding:12px; margin:5px; background-color: #f0ad4e; color: black; font-weight: bold; cursor:pointer; border-radius:5px;">🔥 Falar com Tiao Cangaceiro (Missao Secreta)</button>`;
  }

  if (pistasEncontradas >= 3 || informacaoEspecial) {
    jogo.innerHTML += `
      <hr>
      <h3 style="color: #d9534f;">🚨 HORA DO VEREDITO FINAL:</h3>
      <button onclick="acusar('Seu Ze')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Seu Ze</button>
      <button onclick="acusar('Padre')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Padre</button>
      <button onclick="acusar('Dona Maria')" style="padding:10px; margin:5px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Dona Maria</button>
    `;
  }
}

window.interrogar = function(suspeito) {
  suspeitosInvestigados[suspeito] = true;
  let fala = "";
  let pista = "";

  if (suspeito === "Seu Ze") {
    fala = "<b>Seu Ze:</b> 'Eu estava com as vacas... mas vi marcas estranhas na janela.'";
    pista = "🔍 [PISTA]: Pegada de bota com lama perto da janela!";
    pistasEncontradas++;
  } else if (suspeito === "Padre") {
    fala = "<b>Padre:</b> 'Ouvi passos correndo em direcao ao canavial ontem a noite.'";
    pista = "🔍 [PISTA]: Pedaco de corda de saco de ouro no altar!";
    pistasEncontradas++;
  } else if (suspeito === "Dona Maria") {
    fala = "<b>Dona Maria:</b> 'Vi uma sombra brilhando perto do moinho abandonado.'";
    pista = "🔍 [PISTA]: Botao de camisa luxuosa preso na cerca!";
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

window.iniciarMissao = function() {
  jogo.innerHTML = `
    <h2>🤠 O Acordo com Tiao Cangaceiro</h2>
    <p><b>Tiao:</b> 'Eu invadi o casarao ontem e sei exatamente quem pegou o relogio... Mas perdi minha espingarda no canavial enquanto fugia de um rival. Se voce recupera-la, eu te conto tudo!'</p>
    <br>
    <button onclick="faseCriaturas('serpente')" style="padding:12px; background-color: #d9534f; color:white; font-weight:bold; cursor:pointer;">Avancar no Canavial 🐍</button>
  `;
}

window.faseCriaturas = function(fase) {
  if (vidaJogador <= 0) {
    jogo.innerHTML = `
      <h2 style="color: red;">💀 FIM DE JOGO</h2>
      <p>Voce desmaiou no canavial.</p>
      <button onclick="reiniciarJogo()" style="padding:10px; cursor:pointer;">Tentar Novamente</button>
    `;
    return;
  }

  if (fase === 'serpente') {
    jogo.innerHTML = `
      <h2>⚠️ PERIGO: Uma Serpente apareceu!</h2>
      <p>Vida: <b>${"❤️".repeat(vidaJogador)}</b></p>
      <button onclick="faseCriaturas('bicho')" style="padding:10px; margin:5px; background-color:green; color:white; cursor:pointer;">Atacar a Serpente!</button>
      <button onclick="tomarDano('serpente')" style="padding:10px; margin:5px; background-color:orange; cursor:pointer;">Tentar desviar</button>
    `;
  } else if (fase === 'bicho') {
    jogo.innerHTML = `
      <h2>⚠️ PERIGO: O Rival te cercou!</h2>
      <p>Vida: <b>${"❤️".repeat(vidaJogador)}</b></p>
      <button onclick="faseCriaturas('recuperou')" style="padding:10px; margin:5px; background-color:blue; color:white; cursor:pointer;">Desarmar o rival!</button>
      <button onclick="tomarDano('bicho')" style="padding:10px; margin:5px; background-color:orange; cursor:pointer;">Correr para cima dele</button>
    `;
  } else if (fase === 'recuperou') {
    informacaoEspecial = true;
    suspeitosInvestigados["Cangaceiro"] = true;
    
    jogo.innerHTML = `
      <h2>✨ MISSAO CUMPRIDA!</h2>
      <p>Voce recuperou a Espingarda e entregou ao Tiao!</p>
      <p><b>Tiao:</b> 'Boa! Eu vi o <b>Seu Ze</b> escondendo o relogio no celeiro ontem a noite!'</p>
      <br>
      <button onclick="mostrarPainelInvestigacao()" style="padding:12px; background-color: #5cb85c; color:white; cursor:pointer;">Ir para o Veredito</button>
    `;
  }
}

window.tomarDano = function(ondeParou) {
  vidaJogador--;
  alert("Voce tomou dano e perdeu 1 de vida!");
  if (ondeParou === 'serpente') {
    faseCriaturas('bicho');
  } else {
    faseCriaturas('recuperou');
  }
}

window.acusar = function(suspeitoAcusado) {
  if (suspeitoAcusado === "Seu Ze") {
    jogo.innerHTML = `
      <h2 style='color: green;'>🎉 PARABENS! VOCE VENCEU!</h2>
      <p>O relogio estava no celeiro do Seu Ze! Caso Encerrado!</p>
      <br><button onclick="reiniciarJogo()" style="padding:10px; cursor:pointer;">Jogar Novamente</button>
    `;
  } else {
    jogo.innerHTML = `
      <h2 style='color: red;'>❌ VOCE ERROU!</h2>
      <p>O culpado era outro e fugiu!</p>
      <br><button onclick="reiniciarJogo()" style="padding:10px; cursor:pointer;">Jogar Novamente</button>
    `;
  }
}

window.reiniciarJogo = function() {
  pistasEncontradas = 0;
  vidaJogador = 3;
  informacaoEspecial = false;
  suspeitosInvestigados = { "Seu Ze": false, "Padre": false, "Dona Maria": false, "Cangaceiro": false };
  mostrarPainelInvestigacao();
}

mostrarPainelInvestigacao();