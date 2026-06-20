// Limpando a tela antiga
document.body.innerHTML = "";

// Criando a caixinha do jogo
let jogo = document.createElement("div");
jogo.style.padding = "20px";
jogo.style.fontFamily = "sans-serif";
jogo.style.fontSize = "18px";
jogo.style.lineHeight = "1.6";
document.body.appendChild(jogo);

// Variáveis para controlar o progresso do jogador
let pistasEncontradas = 0;
let suspeitosInvestigados = {
  "Seu Zé": false,
  "Padre": false,
  "Dona Maria": false,
  "Cangaceiro": false
};

// Função principal que mostra a tela inicial de investigação
function mostrarPainelInvestigacao() {
  jogo.innerHTML = `
    <h2>🕵️‍♂️ CASO: O SUMIÇO DO RELÓGIO DE OURO 🕵️‍♂️</h2>
    <p>O Coronel Neto está desesperado! O relógio de bolso da família sumiu do casarão.</p>
    <p>Você precisa investigar os suspeitos no vilarejo para encontrar <b>3 pistas</b> antes de fazer sua acusação final!</p>
    <p><b>Pistas encontradas: ${pistasEncontradas} / 3</b></p>
    <hr>
    <h3>📍 Escolha quem interrogar agora:</h3>
  `;

  // Botão Seu Zé
  if (!suspeitosInvestigados["Seu Zé"]) {
    jogo.innerHTML += `<button onclick="interrogar('Seu Zé')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Interrogar Seu Zé (O Caseiro)</button>`;
  }
  // Botão Padre
  if (!suspeitosInvestigados["Padre"]) {
    jogo.innerHTML += `<button onclick="interrogar('Padre')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Interrogar Padre (Da Igrejinha)</button>`;
  }
  // Botão Dona Maria
  if (!suspeitosInvestigados["Dona Maria"]) {
    jogo.innerHTML += `<button onclick="interrogar('Dona Maria')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Interrogar Dona Maria (A Benzedeira)</button>`;
  }
  // Novo Personagem: O Cangaceiro
  if (!suspeitosInvestigados["Cangaceiro"]) {
    jogo.innerHTML += `<button onclick="interrogar('Cangaceiro')" style="padding:10px; margin:5px; font-size:16px; cursor:pointer;">Interrogar Tião (O Cangaceiro Viajante)</button>`;
  }

  // Só libera a acusação depois de achar pelo menos 3 pistas!
  if (pistasEncontradas >= 3) {
    jogo.innerHTML += `
      <hr>
      <h3 style="color: #d9534f;">🚨 VOCÊ JÁ TEM PISTAS SUFICIENTES! HORA DO VEREDITO:</h3>
      <p>Quem é o verdadeiro culpado pelo roubo?</p>
      <button onclick="acusar('Seu Zé')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Seu Zé</button>
      <button onclick="acusar('Padre')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Padre</button>
      <button onclick="acusar('Dona Maria')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Dona Maria</button>
      <button onclick="acusar('Cangaceiro')" style="padding:10px; margin:5px; font-size:16px; background-color:#ffcccb; font-weight:bold; cursor:pointer;">Acusar Tião Cangaceiro</button>
    `;
  }
}

// Função para processar os interrogatórios
window.interrogar = function(suspeito) {
  suspeitosInvestigados[suspeito] = true; // Marca que já conversou com ele
  let fala = "";
  let pista = "";

  if (suspeito === "Seu Zé") {
    fala = "<b>Seu Zé:</b> 'Eu estava cuidando das vacas, moço... Mas confesso que vi um rastro estranho perto da janela do casarão.'";
    pista = "🔍 <b>[PISTA]:</b> Você achou uma pegada de bota cheia de lama perto da janela!";
    pistasEncontradas++;
  } else if (suspeito === "Padre") {
    fala = "<b>Padre:</b> 'Ontem à noite eu estava rezando sozinho... mas ouvi passos correndo em direção ao canavial.'";
    pista = "🔍 <b>[PISTA]:</b> Você encontrou um pedaço de corda de amarrar saco de ouro perto do altar!";
    pistasEncontradas++;
  } else if (suspeito === "Dona Maria") {
    fala = "<b>Dona Maria:</b> 'Eu estava colhendo ervas e vi uma sombra misteriosa brilhando perto do moinho abandonado tarde da noite!'";
    pista = "🔍 <b>[PISTA]:</b> Você achou um botão de camisa luxuosa preso na cerca de arame!";
    pistasEncontradas++;
  } else if (suspeito === "Cangaceiro") {
    fala = "<b>Tião Cangaceiro:</b> 'Eu acabei de chegar na cidade, seu doutor! Não sei de nada, mas vi o Seu Zé limpando as botas no rio hoje bem cedo...'";
    pista = "🔍 <b>[PISTA]:</b> O depoimento do Tião joga fortes suspeitas sobre o caseiro!";
    pistasEncontradas++;
  }

  // Mostra o resultado do interrogatório na tela
  jogo.innerHTML = `
    <h2>🕵️‍♂️ INTERROGANDO: ${suspeito.toUpperCase()}</h2>
    <p>${fala}</p>
    <p style="color: blue;">${pista}</p>
    <br>
    <button onclick="mostrarPainelInvestigacao()" style="padding:12px; font-size:16px; background-color: #5cb85c; color: white; border: none; cursor:pointer; border-radius: 5px;">Continuar Investigando</button>
  `;
}

// Função do julgamento (Fim do Jogo)
window.acusar = function(suspeitoAcusado) {
  // Resetando o jogo para poder jogar de novo depois
  let botaoReiniciar = `<br><br><button onclick="reiniciar Jogo()" style="padding:10px; font-size:16px; cursor:pointer;">Jogar Novamente</button>`;

  if (suspeitoAcusado === "Seu Zé") {
    jogo.innerHTML = `
      <h2 style='color: green;'>🎉 PARABÉNS, DETETIVE! VOCÊ DESVENDOU O MISTÉRIO!</h2>
      <p>A pegada de lama na janela combinava com as botas dele, e o Tião confirmou que ele tentou limpá-las! O relógio de ouro do Coronel estava escondido no fundo do celeiro do Seu Zé.</p>
      ${botaoReiniciar}
    `;
  } else {
    jogo.innerHTML = `
      <h2 style='color: red;'>❌ VOCÊ ERROU O VEREDITO!</h2>
      <p>Você acusou o(a) <b>${suspeitoAcusado}</b>. Porém, as pistas de lama e o depoimento apontavam para outra pessoa. O verdadeiro ladrão conseguiu escapar do vilarejo!</p>
      ${botaoReiniciar}
    `;
  }
}

// Função para resetar as variáveis e recomeçar
window.reiniciarJogo = function() {
  pistasEncontradas = 0;
  suspeitosInvestigados = { "Seu Zé": false, "Padre": false, "Dona Maria": false, "Cangaceiro": false };
  mostrarPainelInvestigacao();
}

// Inicializa o jogo
mostrarPainelInvestigacao();