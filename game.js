// 1. Criando as variáveis para guardar o progresso do jogador
let pistasColetadas = 0;
let encontrouArmaDoCrime = true; // Mude para false para ver o outro resultado!

// 2. A função que roda quando você interroga o suspeito
function interrogarSeuZe() {
  console.log("Detetive: 'Seu Zé, onde o senhor estava ontem à noite?'");
  console.log("Seu Zé: 'Eu estava cuidando das vacas, moço. Não vi nada!'");
  
  // 3. O sistema tomando uma decisão (If / Else)
  if (encontrouArmaDoCrime === true) {
    console.log("Detetive: 'Mentira! Nós achamos a sua enxada suja perto do canavial.'");
    console.log("Seu Zé fica nervoso e começa a chorar...");
    pistasColetadas = pistasColetadas + 1;
    console.log("Nova pista adicionada! Total de pistas: " + pistasColetadas);
  } else {
    console.log("Detetive: 'Entendi... Se lembrar de algo, me avise.'");
    console.log("Você saiu da casa do Seu Zé sem nenhuma pista nova.");
  }
}

// 4. Executando a conversa
interrogarSeuZe();
