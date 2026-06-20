// Limpa a tela antiga
document.body.innerHTML = "";

// Cria o título
let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila: A Inocência de Tião";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
document.body.appendChild(titulo);

// Cria a tela do jogo (Canvas) - Ajustado para 800x450 para não esticar o mapa
let canvas = document.createElement("canvas");
canvas.width = 800; 
canvas.height = 450;
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
let tiaoImg = new Image(); tiaoImg.src = "tiao.png";
let rivalImg = new Image(); rivalImg.src = "rival.png";

// Configurações do Detetive
let detetive = { x: 380, y: 200, width: 50, height: 50, speed: 5 };

// Controles do Teclado
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Sistema de Pistas
let pistasColetadas = 0;
let totalDePistas = 3;

// Configurações dos Personagens
let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 150, y: 150, width: 50, height: 50, fala: "Eu vi um vulto correndo pro canavial ontem à noite!", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Dona Maria", img: mariaImg, x: 600, y: 350, width: 50, height: 50, fala: "O rival do Tião comprou uma passagem de trem escondido...", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Padre", img: padreImg, x: 650, y: 100, width: 50, height: 50, fala: "Achei esta faca caída perto da igreja. Não é do Tião.", temPista: true, deuPista: false, tipo: "testemunha" },
    { nome: "Tião", img: tiaoImg, x: 300, y: 350, width: 50, height: 50, fala: "Me ajude, detetive! Eu juro que não fiz nada. Ache quem armou pra mim!", temPista: false, deuPista: false, tipo: "aliado" },
    { nome: "Rival", img: rivalImg, x: 100, y: 350, width: 50, height: 50, fala: "", temPista: false, deuPista: false, tipo: "rival" }
];

let mensagemAtual = "";

// Função para checar Colisão
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Atualiza a posição e a lógica do jogo
function update() {
    // Movimentação do Detetive
    if (keys["ArrowUp"]) detetive.y -= detetive.speed;
    if (keys["ArrowDown"]) detetive.y += detetive.speed;
    if (keys["ArrowLeft"]) detetive.x -= detetive.speed;
    if (keys["ArrowRight"]) detetive.x += detetive.speed;

    // Impede o detetive de sair da tela
    if (detetive.x < 0) detetive.x = 0;
    if (detetive.y < 0) detetive.y = 0;
    if (detetive.x + detetive.width > canvas.width) detetive.x = canvas.width - detetive.width;
    if (detetive.y + detetive.height > canvas.height) detetive.y = canvas.height - detetive.height;

    mensagemAtual = ""; 

    // Checa interações
    for (let npc of npcs) {
        if (checkCollision(detetive, npc)) {
            
            // Lógica do Rival (Confronto Final)
            if (npc.tipo === "rival") {
                if (pistasColetadas >= totalDePistas) {
                    mensagemAtual = "Rival: Maldição! Você achou todas as provas! Eu armei pro Tião!";
                } else {
                    mensagemAtual = "Rival: Saia daqui, detetive. Você não tem provas contra mim.";
                }
            } else {
                // Lógica das Testemunhas e do Tião
                mensagemAtual = npc.nome + ": " + npc.fala;
                
                // Coleta a pista se o NPC tiver uma e ainda não entregou
                if (npc.temPista && !npc.deuPista) {
                    npc.deuPista = true;
                    pistasColetadas++;
                }
            }
        }
    }
}

// Desenha os gráficos na tela
function draw() {
    // 1. Mapa
    ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);

    // 2. NPCs (Suspeitos, Tião e Rival)
    for (let npc of npcs) {
        ctx.drawImage(npc.img, npc.x, npc.y, npc.width, npc.height);
        
        // Desenha um alerta (!) em cima de quem tem pista e ainda não deu
        if (npc.temPista && !npc.deuPista) {
            ctx.fillStyle = "yellow";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText("!", npc.x + 20, npc.y - 10);
        }
    }

    // 3. Detetive
    ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.width, detetive.height);

    // 4. Interface (UI) de Pistas Coletadas
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 150, 40);
    ctx.fillStyle = "white";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Pistas: " + pistasColetadas + " / " + totalDePistas, 20, 35);

    // 5. Caixa de Diálogo
    if (mensagemAtual !== "") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
        ctx.fillRect(40, 360, 720, 70); 
        ctx.fillStyle = "white"; 
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(mensagemAtual, 60, 400); 
    }

    requestAnimationFrame(gameLoop);
}

// Loop Principal
function gameLoop() {
    update();
    draw();
}

// Inicia
mapaImg.onload = () => {
    gameLoop();
};
