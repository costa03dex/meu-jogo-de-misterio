// Limpa a tela e força o Fullscreen sem barras de rolagem
document.body.innerHTML = "";
document.body.style.margin = "0"; 
document.body.style.padding = "0"; 
document.body.style.overflow = "hidden"; // Bloqueia rolagem do site
document.body.style.backgroundColor = "#222"; 

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
titulo.style.zIndex = "10"; 
document.body.appendChild(titulo);

// Configuração da Tela com a Nova Proporção (1408x768)
let canvas = document.createElement("canvas");
canvas.width = 1408;  
canvas.height = 768;
canvas.style.display = "block";
canvas.style.position = "absolute"; 
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";  
canvas.style.height = "100vh"; 
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

function carregarImagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}

// ARQUIVOS - AQUI ESTAVA O PROBLEMA! Mudei para mapa.png
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
    // Bloqueia a rolagem do site com setas e espaço
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
