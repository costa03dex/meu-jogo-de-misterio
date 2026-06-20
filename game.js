// --- CONFIGURAÇÃO INICIAL DO JOGO ---

let temPegadaNaLama = false;
let temTecidoNoArame = false;
let temBilheteRasgado = false;
let totalPistasConseguiu = 0;

// MUDE O NOME AQUI para testar outros: "Seu Zé", "Padre" ou "Dona Maria"
let suspeitoAtual = "Padre"; 

// --- INÍCIO DA HISTÓRIA ---
console.log("--- CASO: O SUMIÇO DO RELÓGIO DE OURO ---");
console.log("O Coronel Neto está desesperado! O relógio de bolso da família sumiu.");
console.log("Você está no vilarejo investigando o suspeito: " + suspeitoAtual);

// 1. Interrogatório do Seu Zé
if (suspeitoAtual === "Seu Zé") {
  console.log("Detetive: 'Seu Zé, onde o senhor estava na hora do crime?'");
  console.log("Seu Zé: 'Cuidando das vacas, moço... Mas confesso que andei perto do casarão.'");
  
  temPegadaNaLama = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou uma pegada de bota de lama perto da janela!");
  console.log("Total de pistas encontradas: " + totalPistasConseguiu);
}

// 2. Interrogatório do Padre
else if (suspeitoAtual === "Padre") {
  console.log("Você vai até a igrejinha da cidade...");
  console.log("Padre: 'Ontem à noite eu estava rezando sozinho... mas ouvi passos no canavial.'");
  
  temBilheteRasgado = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou um bilhete rasgado perto do altar!");
  console.log("Total de pistas encontradas: " + totalPistasConseguiu);
}

// 3. Interrogatório da Dona Maria
else if (suspeitoAtual === "Dona Maria") {
  console.log("Você vai até a casa da benzedeira na beira do canavial...");
  console.log("Dona Maria: 'Eu vi uma luz estranha brilhando perto do moinho abandonado tarde da noite!'");
  
  temTecidoNoArame = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou um pedaço de tecido preso na cerca!");
  console.log("Total de pistas encontradas: " + totalPistasConseguiu);
}
