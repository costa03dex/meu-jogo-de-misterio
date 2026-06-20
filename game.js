// Limpa a tela antiga
document.body.innerHTML = "";

// Cria o título
let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
document.body.appendChild(titulo);

// Cria a tela do jogo (Canvas)
let canvas = document.createElement("canvas");
canvas.width = 800; // Deixei maior para o mapa ficar bonito
canvas.height = 600;
canvas.style.display = "block";
canvas.style.margin = "0 auto";
canvas.style.border = "4px solid #333";
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

// Carregando as Imagens
let mapaImg = new Image(); mapaImg.src = "mapa.png";
let detetiveImg = new Image(); detetiveImg.src = "detetive.png";
let zeImg = new Image(); zeImg.src = "ze.png";
let mariaImg = new Image(); mariaImg.src = "maria.png";
let padreImg = new Image(); padreImg.src = "padre.png";

// Configurações do Detetive (Seu personagem)
let detetive = { x: 400, y: 300, width: 50, height: 50, speed: 5 };

// Controles do Teclado
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Configurações dos Suspeitos (NPCs)
// Você pode mudar o 'x' e 'y' para colocar eles onde quiser no mapa!
let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 150, y: 150, width: 50, height: 50, fala: "Eu vi um vulto correndo pro canavial ontem à noite!" },
    { nome: "Dona Maria", img: mariaImg, x: 600, y: 400, width: 50, height: 50, fala: "O padre estava agindo estranho depois da missa..." },
    { nome: "Padre", img: padreImg, x: 650, y: 150, width: 50, height: 50, fala: "Só Deus sabe os segredos dessa vila, meu filho." }
];

let mensagemAtual = "";

// Função para checar Colisão (quando um encosta no outro)
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Atualiza a posição e as colisões
function update() {
    // Movimentação
    if (keys["ArrowUp"]) detetive.y -= detetive.speed;
    if (keys["ArrowDown"]) detetive.y += detetive.speed;
    if (keys["ArrowLeft"]) detetive.x -= detetive.speed;
    if (keys["ArrowRight"]) detetive.x += detetive.speed;

    mensagemAtual = ""; // Limpa a mensagem se não estiver encostando

    // Checa se encostou em algum suspeito
    for (let npc of npcs) {
        if (checkCollision(detetive, npc)) {
            mensagemAtual = npc.nome + ": " + npc.fala;
        }
    }
}

// Desenha tudo na tela
function draw() {
    // 1. Desenha o mapa primeiro (no fundo)
    ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);

    // 2. Desenha os Suspeitos
    for (let npc of npcs) {
        ctx.drawImage(npc.img, npc.x, npc.y, npc.width, npc.height);
    }

    // 3. Desenha o Detetive
    ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.width, detetive.height);

    // 4. Desenha a Caixa de Diálogo se houver mensagem
    if (mensagemAtual !== "") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Fundo preto um pouco transparente
        ctx.fillRect(50, 500, 700, 80); // Posição e tamanho da caixa
        ctx.fillStyle = "white"; // Cor do texto
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(mensagemAtual, 70, 545); // Posição do texto
    }

    requestAnimationFrame(gameLoop);
}

// O Loop do Jogo (Roda várias vezes por segundo)
function gameLoop() {
    update();
    draw();
}

// Só inicia o jogo quando a imagem do mapa carregar
mapaImg.onload = () => {
    gameLoop();
};
