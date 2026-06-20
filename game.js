// --- CONFIGURAÇÃO INICIAL DO JOGO ---

// As pistas que o jogador pode encontrar (começam como false porque ainda não foram achadas)
let temPegadaNaLama = false;
let temTecidoNoArame = false;
let temBilheteRasgado = false;

// Contador de pistas coletadas
let totalPistasConseguiu = 0;

// O suspeito que o jogador está investigando no momento
let suspeitoAtual = "Seu Zé"; 

// --- INÍCIO DA HISTÓRIA ---
console.log("--- CASO: O SUMIÇO DO RELÓGIO DE OURO ---");
console.log("O Coronel Neto está desesperado! O relógio de bolso da família sumiu.");
console.log("Você está no vilarejo investigando o suspeito: " + suspeitoAtual);

// Lógica do primeiro interrogatório (Seu Zé)
if (suspeitoAtual === "Seu Zé") {
  console.log("Detetive: 'Seu Zé, onde o senhor estava na hora do crime?'");
  console.log("Seu Zé: 'Cuidando das vacas, moço... Mas confesso que andei perto do casarão.'");
  
  // O detetive olha em volta e acha a primeira pista!
  temPegadaNaLama = true;
  totalPistasConseguiu = totalPistasConseguiu + 1;
  
  console.log("🔍 [PISTA ENCONTRADA]: Você achou uma pegada de bota de lama perto da janela!");
  console.log("Total de pistas encontradas: " + totalPistasConseguiu);
}
