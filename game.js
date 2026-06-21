// Limpa a tela e força o Fullscreen sem barras de rolagem
document.body.innerHTML = "";
document.body.style.margin = "0"; 
document.body.style.padding = "0"; 
document.body.style.overflow = "hidden"; // Bloqueia qualquer rolagem do site
document.body.style.backgroundColor = "#000";

// Título flutuante
let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila: O Interrogatório Final";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
titulo.style.color = "#fff";
titulo.style.position = "absolute"; 
titulo.style.width = "100%";
titulo.style.top = "15px";
titulo.style.textShadow = "2px 2px 5px rgba(0,0,0,0.9)";
titulo.style.pointerEvents = "none"; 
titulo.style.zIndex = "10"; // Garante que o título fique por cima do jogo
document.body.appendChild(titulo);

// Configuração da Tela com a Nova Proporção (1408x768)
let canvas = document.createElement("canvas");
canvas.width = 1408;  
canvas.height = 768;
canvas.style.display = "block";
canvas.style.position = "absolute"; // Fixa o jogo no canto da tela
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";  // Estica 100% da largura
canvas.style.height = "100vh"; // Estica 100% da altura
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

function carregarImagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}

// Arquivos 
let mapaImg = carregarImagem("mapa.jpg"); 
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

// Jogador
let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

// NPCs
let npcs = [
    { 
        nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. Viu algo estranho na noite do roubo?", 
        resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true,
        pergunta2: "2. Como é o Tião?", 
        resposta2: "Tião é trabalhador, nunca roubou nem uma galinha.", daPista2: false
    },
    { 
        nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. O que você encontrou na casa do Tião?", 
        resposta1: "Achei um lenço chique no chão. O Tião não usa seda... mas o Rival sim.", daPista1: true,
        pergunta2: "2. O Tião tem inimigos?", 
        resposta2: "Apenas o Rival. Eles brigaram por terras mês passado.", daPista2: false
    },
    { 
        nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha",
        pistaColetada: false,
        pergunta1: "1. O que o Tião estava fazendo na hora do crime?", 
        resposta1: "Ele estava comigo na igreja, ajudando a limpar o altar.", daPista1: false,
        pergunta2: "2. O Rival tem se confessado?", 
        resposta2: "Sim, ele me confessou um ódio profundo e um plano contra o Tião.", daPista2: true
    },
    { 
        nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado",
        pistaColetada: false,
        pergunta1: "1. Fique calmo, vou te tirar dessa.", 
        resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false,
        pergunta2: "2. Quem você acha que te incriminou?", 
        resposta2: "Só pode ser aquele engravatado do Rival!", daPista2: false
    },
    { 
        nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival"
    }
];

let keys = {};

window.addEventListener("keydown", (e) => {
    // ISSO AQUI BLOQUEIA A ROLAGEM DO SITE (AS SETINHAS E O ESPAÇO)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    keys[e.key] = true;

    if (e.key === " " && estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            estadoJogo = "DIALOGO";
            npcFoco = perto;
            textoResposta = "";
            
            if (npcFoco.tipo === "rival") {
                if (pistasColetadas >= totalPistas) {
                    textoResposta = "RIVAL: Maldição... Como você descobriu? FUI EU! Eu armei tudo!";
                    setTimeout(() => { estadoJogo = "FIM"; }, 4000); 
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

        if (detetive.x < 0) detetive.x = 0;
        if (detetive.y < 0) detetive.y = 0;
        if (detetive.x + detetive.w > canvas.width) detetive.x = canvas.width - detetive.w;
        if (detetive.y + detetive.h > canvas.height) detetive.y = canvas.height - detetive.h;
    }
}

function draw() {
    ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);

    for (let npc of npcs) {
        ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h);
        
        if (npc.tipo === "testemunha" && !npc.pistaColetada) {
            ctx.fillStyle = "yellow";
            ctx.font = "bold 35px Arial";
            ctx.fillText("!", npc.x + 35, npc.y - 5);
        }
    }

    ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.w, detetive.h);

    if (estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(detetive.x - 20, detetive.y - 45, 130, 30);
            ctx.fillStyle = "white";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText("Aperte ESPAÇO", detetive.x - 5, detetive.y - 25);
        }
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(40, 70, 200, 45); 
    ctx.strokeStyle = "#64ffda";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 70, 200, 45);
    ctx.fillStyle = "#64ffda";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " / " + totalPistas, 65, 98);

    if (estadoJogo === "DIALOGO") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(154, 540, 1100, 180);
        ctx.strokeStyle = "#64ffda";
        ctx.lineWidth = 4;
        ctx.strokeRect(154, 540, 1100, 180);
        
        ctx.fillStyle = "#64ffda";
        ctx.font = "bold 26px Arial";
        ctx.fillText(npcFoco.nome + ":", 190, 585);

        ctx.fillStyle = "white";
        ctx.font = "21px Arial";

        if (textoResposta !== "") {
            ctx.fillText(textoResposta, 190, 635);
            ctx.fillStyle = "#94a3b8";
            ctx.font = "16px Arial";
            ctx.fillText("[ Aperte ESPAÇO para fechar ]", 190, 690);
        } 
        else if (npcFoco.tipo !== "rival") {
            ctx.fillStyle = "#e2e8f0";
            ctx.fillText("Escolha o que perguntar (aperte 1 ou 2 no seu teclado):", 190, 625);
            ctx.fillStyle = "#64ffda";
            ctx.fillText(npcFoco.pergunta1, 210, 665);
            ctx.fillText(npcFoco.pergunta2, 210, 695);
        }
    }

    if (estadoJogo === "FIM") {
        ctx.fillStyle = "rgba(0, 15, 5, 0.92)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#ffe600"; 
        ctx.textAlign = "center";
        ctx.font = "bold 70px sans-serif";
        ctx.fillText("🏆 VOCÊ VENCEU!", canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = "white";
        ctx.font = "26px sans-serif";
        ctx.fillText("As pistas estavam certas! O Rival foi desmascarado,", canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText("e o inocente Tião está livre. O mistério acabou!", canvas.width / 2, canvas.height / 2 + 70);
        
        ctx.fillStyle = "#64ffda";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(">> Atualize a página (F5) para jogar novamente <<", canvas.width / 2, canvas.height / 2 + 150);
        
        ctx.textAlign = "left"; 
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    draw();
}

mapaImg.onload = () => gameLoop();
