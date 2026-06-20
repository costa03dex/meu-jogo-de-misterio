// Limpa a tela antiga
document.body.innerHTML = "";

// Cria o título
let titulo = document.createElement("h2");
titulo.innerText = "🕹️ Teste de Movimentação 2D (Use as Setas do Teclado)";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
document.body.appendChild(titulo);

// Cria a tela do jogo (Canvas)
let canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
canvas.style.backgroundColor = "#e0e0e0";
canvas.style.display = "block";
canvas.style.margin = "0 auto";
canvas.style.border = "4px solid #333";
document.body.appendChild(canvas);

// Contexto para desenhar na tela
let ctx = canvas.getContext("2d");

// Posição e tamanho do Detetive (Quadrado Azul)
let detetive = {
  x: 50,
  y: 180,
  tamanho: 30,
  velocidade: 5
};

// Posição do Suspeito (Quadrado Vermelho)
let suspeito = {
  x: 450,
  y: 170,
  tamanho: 40
};

// Objeto para guardar quais teclas estão pressionadas
let teclas = {};

// Escuta quando o jogador aperta uma tecla
window.addEventListener("keydown", function(evento) {
  teclas[evento.key] = true;
});

// Escuta quando o jogador solta uma tecla
window.addEventListener("keyup", function(evento) {
  teclas[evento.key] = false;
});

// Função que atualiza a lógica do jogo (Movimentação)
function atualizar() {
  // Move para a esquerda
  if (teclas["ArrowLeft"] && detetive.x > 0) {
    detetive.x -= detetive.velocidade;
  }
  // Move para a direita
  if (teclas["ArrowRight"] && detetive.x < canvas.width - detetive.tamanho) {
    detetive.x += detetive.velocidade;
  }
  // Move para cima
  if (teclas["ArrowUp"] && detetive.y > 0) {
    detetive.y -= detetive.velocidade;
  }
  // Move para baixo
  if (teclas["ArrowDown"] && detetive.y < canvas.height - detetive.tamanho) {
    detetive.y += detetive.velocidade;
  }

  // Lógica de "Colisão" (Se o detetive encostar no suspeito)
  if (
    detetive.x < suspeito.x + suspeito.tamanho &&
    detetive.x + detetive.tamanho > suspeito.x &&
    detetive.y < suspeito.y + suspeito.tamanho &&
    detetive.y + detetive.tamanho > suspeito.y
  ) {
    // Se encostar, muda a cor do suspeito para verde como feedback
    suspeito.cor = "green";
  } else {
    suspeito.cor = "red";
  }
}

// Função que desenha tudo na tela
function desenhar() {
  // Limpa a tela inteira para desenhar de novo
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o Suspeito (Alvo)
  ctx.fillStyle = suspeito.cor;
  ctx.fillRect(suspeito.x, suspeito.y, suspeito.tamanho, suspeito.tamanho);
  
  // Texto em cima do suspeito
  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText("Suspeito", suspeito.x - 5, suspeito.y - 10);

  // Desenha o Detetive (Jogador)
  ctx.fillStyle = "blue";
  ctx.fillRect(detetive.x, detetive.y, detetive.tamanho, detetive.tamanho);
}

// O "Game Loop" - Executa isso sem parar para animar o jogo
function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop); // Chama o próximo frame de animação
}

// Inicia o motor do jogo 2D
loop();