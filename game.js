// Limpa a tela
document.body.innerHTML = "";

let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila: O Interrogatório";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
titulo.style.color = "#fff";
document.body.appendChild(titulo);

// Configuração da Tela
let canvas = document.createElement("canvas");
canvas.width = 1304; 
canvas.height = 668;
canvas.style.display = "block";
canvas.style.margin = "0 auto";
canvas.style.border = "5px solid #222";
canvas.style.backgroundColor = "#000";
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

function carregarImagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}

// Já ajustado para mapa.png!
let mapaImg = carregarImagem("mapa.png"); 
let detetiveImg = carregarImagem("detetive.png");
let zeImg = carregarImagem("ze.png");
let mariaImg = carregarImagem("maria.png");
let padreImg = carregarImagem("padre.png");
let tiaoImg = carregarImagem("tiao.png");
let rivalImg = carregarImagem("rival.png");

// --- VARIÁVEIS DE ESTADO ---
let estadoJogo = "EXPLORANDO"; 
let npcFoco = null; 
let textoResposta = ""; 
let pistasColetadas = 0;
let totalPistas = 3;

// Jogador (Tamanho 75x75, perfeito para as casas)
let detetive = { x: 600, y: 320, w: 75, h: 75, speed: 6 };

// NPCs espalhados perfeitamente pelo novo mapa
let npcs = [
    { 
        nome: "Seu Zé", img: zeImg, x: 180, y: 250, w: 75, h: 75, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. Viu algo estranho na noite do roubo?", 
        resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true,
        pergunta2: "2. Como é o Tião?", 
        resposta2: "Tião é trabalhador, nunca roubou nem uma galinha.", daPista2: false
    },
    { 
        nome: "Dona Maria", img: mariaImg, x: 1000, y: 480, w: 75, h: 75, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. O que você encontrou na casa do Tião?", 
        resposta1: "Achei um lenço chique no chão. O Tião não usa seda... mas o Rival sim.", daPista1: true,
        pergunta2: "2. O Tião tem inimigos?", 
        resposta2: "Apenas o Rival. Eles brigaram por terras mês passado.", daPista2: false
    },
    { 
        nome: "Padre", img: padreImg, x: 900, y: 250, w: 75, h: 75, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. O que o Tião estava fazendo na hora do crime?", 
        resposta1: "Ele estava comigo na igreja, ajudando a limpar o altar.", daPista1: false,
        pergunta2: "2. O Rival tem se confessado?", 
        resposta2: "Sim, ele me confessou um ódio profundo e um plano contra o Tião.", daPista2: true
    },
    { 
        nome: "Tião", img: tiaoImg, x: 500, y: 520, w: 75, h: 75, tipo: "aliado",
        pistaColetada: false,
        pergunta1: "1. Fique calmo, vou te tirar dessa.", 
        resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false,
        pergunta2: "2. Quem você acha que te incriminou?", 
        resposta2: "Só pode ser aquele engravatado do Rival!", daPista2: false
    },
    { 
        nome: "Rival", img: rivalImg, x: 100, y: 480, w: 75, h: 75, tipo: "rival"
    }
];

let keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === " " && estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            estadoJogo = "DIALOGO";
            npcFoco = perto;
            textoResposta = "";
            
            if (npcFoco.tipo === "rival") {
                if (pistasColetadas >= totalPistas) {
                    textoResposta = "RIVAL: Não... como você descobriu? FUI EU! Eu armei tudo!";
                    setTimeout(() => { estadoJogo = "FIM"; }, 3500); 
                } else {
                    textoResposta = "RIVAL: Saia daqui, seu xereta. Volte quando tiver provas de verdade!";
                }
            }
        }
    } 
    else if (e.key === " " && estadoJogo === "DIALOGO" && textoResposta !== "") {
        if (estadoJogo !== "FIM") { 
            estadoJogo = "EXPLORANDO";
            npcFoco = null;
        }
    }

    if (estadoJogo === "DIALOGO" && textoResposta === "" && npcFoco.tipo !== "rival") {
        if (e.key === "1") {
            textoResposta = npcFoco.resposta1;
            if (npcFoco.daPista1 && !npcFoco.pistaColetada) {
                pistasColetadas++;
                npcFoco.pistaColetada = true;
            }
        }
        if (e.key === "2") {
            textoResposta = npcFoco.resposta2;
            if (npcFoco.daPista2 && !npcFoco.pistaColetada) {
                pistasColetadas++;
                npcFoco.pistaColetada = true;
            }
        }
    }
});

window.addEventListener("keyup", (e) => keys[e.key] = false);

function colidindo(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

function update() {
    if (estadoJogo === "EXPLORANDO") {
        if (keys["ArrowUp"]) detetive.y -= detetive.speed;
        if (keys["ArrowDown"]) detetive.y += detetive.speed;
        if (keys["ArrowLeft"]) detetive.x -= detetive.speed;
        if (keys["ArrowRight"]) detetive.x += detetive.speed;

        // Limites da tela total
        if (detetive.x < 0) detetive.x = 0;
        if (detetive.y < 0) detetive.y = 0;
        if (detetive.x + detetive.w > canvas.width) detetive.x = canvas.width - detetive.w;
        if (detetive.y + detetive.h > canvas.height) detetive.y = canvas.height - detetive.h;
    }
}

function draw() {
    // Fundo desenhado cobrindo a tela toda
    ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);

    for (let npc of npcs) {
        ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h);
        
        if (npc.tipo === "testemunha" && !npc.pistaColetada) {
            ctx.fillStyle = "yellow";
            ctx.font = "bold 30px Arial";
            ctx.fillText("!", npc.x + 30, npc.y - 10);
        }
    }

    ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.w, detetive.h);

    if (estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(detetive.x - 25, detetive.y - 45, 130, 30);
            ctx.fillStyle = "white";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText("Aperte ESPAÇO", detetive.x - 10, detetive.y - 25);
        }
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(30, 30, 200, 45);
    ctx.strokeStyle = "#64ffda";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 200, 45);
    ctx.fillStyle = "#64ffda";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " /
