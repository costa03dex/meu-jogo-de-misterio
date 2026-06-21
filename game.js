// Limpa a tela antiga para evitar duplicatas
document.body.innerHTML = "";

// Cria o título do jogo
let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila: O Confronto Final";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
titulo.style.color = "#fff"; // Mudei para branco para destacar
document.body.appendChild(titulo);

// --- CONFIGURAÇÃO DA TELA (1304 x 668) ---
let canvas = document.createElement("canvas");
canvas.width = 1304; 
canvas.height = 668;
canvas.style.display = "block";
canvas.style.margin = "0 auto";
canvas.style.border = "5px solid #222";
canvas.style.backgroundColor = "#000";
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

// --- CARREGANDO AS IMAGENS ---
function carregarImagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}

// Os nomes aqui precisam bater EXATAMENTE com o seu GitHub (já estão certos)
let mapaImg = carregarImagem("mapa.png");
let detetiveImg = carregarImagem("detetive.png");
let zeImg = carregarImagem("ze.png");
let mariaImg = carregarImagem("maria.png");
let padreImg = carregarImagem("padre.png");
let tiaoImg = carregarImagem("tiao.png");
let rivalImg = carregarImagem("rival.png");

// --- CONFIGURAÇÕES DO JOGADOR ---
let detetive = { 
    x: 650, y: 334, 
    width: 60, height: 60, 
    speed: 6 
};

// --- SISTEMA DE PISTAS ---
let pistasColetadas = 0;
let totalDePistas = 3;

// --- PERSONAGENS (NPCs) ---
let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 150, w: 60, h: 60, fala: "Vi o Rival correndo pra mata com um saco de moedas!", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Dona Maria", img: mariaImg, x: 1000, y: 550, w: 60, h: 60, fala: "Achei um lenço do Rival no chão da casa do Tião...", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Padre", img: padreImg, x: 1100, y: 120, w: 60, h: 60, fala: "O Rival me confessou ódio pelo Tião ontem.", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Tião", img: tiaoImg, x: 550, y: 500, w: 65, h: 65, fala: "Por favor, detetive! Prove que eu não roubei nada!", temPista: false, deuPista: false, tipo: "aliado" },
    { nome: "Rival", img: rivalImg, x: 150, y: 530, w: 65, h: 65, fala: "", temPista: false, deuPista: false, tipo: "rival" }
];

let mensagemAtual = "";
let keys = {};

// Controles do teclado
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Checa se um personagem encostou no outro
function colidindo(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.width > r2.x && r1.y < r2.y + r2.h && r1.y + r1.height > r2.y);
}

// Atualiza a posição e as regras do jogo
function update() {
    if (keys["ArrowUp"]) detetive.y -= detetive.speed;
    if (keys["ArrowDown"]) detetive.y += detetive.speed;
    if (keys["ArrowLeft"]) detetive.x -= detetive.speed;
    if (keys["ArrowRight"]) detetive.x += detetive.speed;

    // Impede de sair da tela
    if (detetive.x < 0) detetive.x = 0;
    if (detetive.y < 0) detetive.y = 0;
    if (detetive.x + detetive.width > canvas.width) detetive.x = canvas.width - detetive.width;
    if (detetive.y + detetive.height > canvas.height) detetive.y = canvas.height - detetive.height;

    mensagemAtual = "";

    // Checa conversas e pistas
    for (let npc of npcs) {
        if (colidindo(detetive, npc)) {
            if (npc.tipo === "rival") {
                if (pistasColetadas >= totalDePistas) {
                    mensagemAtual = "RIVAL: Maldição! Você provou tudo! Eu armei pro Tião mesmo!";
                } else {
                    mensagemAtual = "RIVAL: Hahaha! Sem provas, você não pode me prender!";
                }
            } else {
                mensagemAtual = npc.nome + ": " + npc.fala;
                if (npc.temPista && !npc.deuPista) {
                    npc.deuPista = true;
                    pistasColetadas++;
                }
            }
        }
    }
}

// Desenha tudo na tela
function draw() {
    // 1. Mapa
    ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);

    // 2. NPCs (Personagens)
    for (let npc of npcs) {
        ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h);
        // Desenha a exclamação se tiver pista não coletada
        if (npc.temPista && !npc.deuPista) {
            ctx.fillStyle = "yellow";
            ctx.font = "bold 30px Arial";
            ctx.fillText("!", npc.x + 25, npc.y - 10);
        }
    }

    // 3. Detetive
    ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.width, detetive.height);

    // 4. Interface (UI) de Pistas
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(20, 20, 220, 50);
    ctx.fillStyle = "#64ffda";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " / " + totalDePistas, 40, 52);

    // 5. Caixa de Diálogo
    if (mensagemAtual !== "") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(150, 580, 1000, 70);
        ctx.strokeStyle = "#64ffda";
        ctx.lineWidth = 2;
        ctx.strokeRect(150, 580, 1000, 70);
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(mensagemAtual, 180, 622);
    }

    requestAnimationFrame(gameLoop);
}

// Roda o jogo sem parar
function gameLoop() {
    update();
    draw();
}

// Só começa quando o mapa carregar
mapaImg.onload = () => gameLoop();
