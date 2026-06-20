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

// --- INÍCIO DA HISTÓRIA ---
console.log("--- CASO: O SUMIÇO DO RELÓGIO DE OURO ---");
console.log("O Coronel Neto está desesperado! O relógio de bolso da família sumiu.");
console.log("Você está no vilarejo investigando o suspeito: " + suspeitoAtual);

// Interrogatório do Seu Zé
if (suspeitoAtual === "Seu Zé") {
  console.log("Detetive: 'Seu Zé, onde o senhor estava na hora do crime?'");
  console.log("Seu Zé: 'Cuidando das vacas, moço... Mas confesso que andei perto do casarão.'");
  
  temPegadaNaLama = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou uma pegada de bota de lama perto da janela!");
}

// Interrogatório do Padre
else if (suspeitoAtual === "Padre") {
  console.log("Você vai até a igrejinha da cidade...");
  console.log("Padre: 'Ontem à noite eu estava rezando sozinho... mas ouvi passos no canavial.'");
  
  temBilheteRasgado = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou um bilhete rasgado perto do altar!");
}

// Interrogatório da Dona Maria
else if (suspeitoAtual === "Dona Maria") {
  console.log("Você vai até a casa da benzedeira na beira do canavial...");
  console.log("Dona Maria: 'Eu vi uma luz estranha brilhando perto do moinho abandonado tarde da noite!'");
  
  temTecidoNoArame = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou um pedaço de tecido preso na cerca!");
}

console.log("---------------------------------------------");
console.log("Total de pistas encontradas na rodada: " + totalPistasConseguiu);
console.log("O tempo acabou! Hora de dar o veredito.");
console.log("Você acusou oficialmente: " + quemVoceVaiAcusar);
console.log("---------------------------------------------");

// --- O JULGAMENTO (FIM DO JOGO) ---

// O verdadeiro culpado neste mistério é o Seu Zé (a bota de lama entrega ele)!
if (quemVoceVaiAcusar === "Seu Zé") {
  console.log("🎉 PARABÉNS, DETETIVE! Você acertou!");
  console.log("A pegada de lama na janela combinava com as botas do Seu Zé. O relógio estava no celeiro dele!");
} else {
  console.log("❌ VOCÊ ERROU O PALPITE!");
  console.log("O suspeito acusado tinha um álibi perfeito. O verdadeiro ladrão fugiu com o relógio do Coronel!");
}
