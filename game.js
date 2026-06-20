// --- CONFIGURAÇÃO INICIAL DO JOGO ---
let temPegadaNaLama = false;
let temTecidoNoArame = false;
let temBilheteRasgado = false;
let totalPistasConseguiu = 0;

// 1. ESCOLHA QUEM INVESTIGAR: "Seu Zé", "Padre" ou "Dona Maria"
let suspeitoAtual = "Padre"; 

// 2. FAÇA SUA ACUSAÇÃO NO FINAL: QUEM É O CULPADO? 
// Escolha entre: "Seu Zé", "Padre" ou "Dona Maria"
let quemVoceVaiAcusar = "Seu Zé"; 

// Criando a tela para o jogo aparecer no site
let tela = document.createElement("div");
tela.style.padding = "20px";
tela.style.fontFamily = "sans-serif";
tela.style.lineHeight = "1.6";
tela.style.fontSize = "18px";
document.body.appendChild(tela);

function mostrar(texto) {
  tela.innerHTML += texto + "<br>";
}

// --- INÍCIO DA HISTÓRIA ---
mostrar("<h2>🕵️‍♂️ CASO: O SUMIÇO DO RELÓGIO DE OURO 🕵️‍♂️</h2>");
mostrar("O Coronel Neto está desesperado! O relógio de bolso da família sumiu.");
mostrar("Você está no vilarejo investigando o suspeito: <b>" + suspeitoAtual + "</b>");
mostrar("<hr>");

// Interrogatório do Seu Zé
if (suspeitoAtual === "Seu Zé") {
  mostrar("<b>Detetive:</b> 'Seu Zé, onde o senhor estava na hora do crime?'");
  mostrar("<b>Seu Zé:</b> 'Cuidando das vacas, moço... Mas confesso que andei perto do casarão.'");
  
  temPegadaNaLama = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  mostrar("<br>🔍 <b>[PISTA ENCONTRADA]:</b> Você achou uma pegada de bota de lama perto da janela!");
}

// Interrogatório do Padre
else if (suspeitoAtual === "Padre") {
  mostrar("Você vai até a igrejinha da cidade...");
  mostrar("<b>Padre:</b> 'Ontem à noite eu estava rezando sozinho... mas ouvi passos no canavial.'");
  
  temBilheteRasgado = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  mostrar("<br>🔍 <b>[PISTA ENCONTRADA]:</b> Você achou um bilhete rasgado perto do altar!");
}

// Interrogatório da Dona Maria
else if (suspeitoAtual === "Dona Maria") {
  mostrar("Você vai até a casa da benzedeira na beira do canavial...");
  mostrar("<b>Dona Maria:</b> 'Eu vi uma luz estranha brilhando perto do moinho abandonado tarde da noite!'");
  
  temTecidoNoArame = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  mostrar("<br>🔍 <b>[PISTA ENCONTRADA]:</b> Você achou um pedaço de tecido preso na cerca!");
}

mostrar("<hr>");
mostrar("Total de pistas encontradas na rodada: <b>" + totalPistasConseguiu + "</b>");
mostrar("O tempo acabou! Hora de dar o veredito.");
mostrar("Você acusou oficialmente: <b>" + quemVoceVaiAcusar + "</b>");
mostrar("<hr>");

// --- O JULGAMENTO (FIM DO JOGO) ---
if (quemVoceVaiAcusar === "Seu Zé") {
  mostrar("<h3 style='color: green;'>🎉 PARABÉNS, DETETIVE! Você acertou!</h3>");
  mostrar("A pegada de lama na janela combinava com as botas do Seu Zé. O relógio estava no celeiro dele!");
} else {
  mostrar("<h3 style='color: red;'>❌ VOCÊ ERROU O PALPITE!</h3>");
  mostrar("O suspeito acusado tinha um álibi perfeito. O verdadeiro ladrão fugiu com o relógio do Coronel!");
}