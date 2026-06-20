// O inventário do detetive
let pistas = 0;
let suspeitoEscolhido = "Padre"; // Mude para "Seu Zé" para interrogar o outro!

console.log("--- INVESTIGAÇÃO: MISTÉRIO NA ROÇA ---");
console.log("Você está na praça da cidade. Quem você quer interrogar?");

if (suspeitoEscolhido === "Seu Zé") {
  console.log("Você vai até a fazenda...");
  console.log("Seu Zé: 'Eu estava cuidando das vacas, moço. Não vi nada!'");
} 
else if (suspeitoEscolhido === "Padre") {
  console.log("Você vai até a igrejinha da cidade...");
  console.log("Padre: 'Ontem à noite eu estava rezando sozinho... mas ouvi passos no canavial.'");
  pistas = pistas + 1;
  console.log("Nova pista obtida! Total de pistas: " + pistas);
} 
else {
  console.log("Esse suspeito não existe na cidade.");
}