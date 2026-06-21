// Limpa a tela, força o Fullscreen e adiciona estilos
document.body.innerHTML = "";
document.body.style.margin = "0"; 
document.body.style.padding = "0"; 
document.body.style.overflow = "hidden"; 
document.body.style.backgroundColor = "#222"; 

// --- DETECTOR DE CELULAR (Esconde botões no PC) ---
let estilo = document.createElement("style");
estilo.innerHTML = `
    .btn-mobile { display: none; }
    /* Só mostra os controles se a tela for menor ou se tiver tela de toque */
    @media (max-width: 1024px), (pointer: coarse) {
        .btn-mobile { display: flex !important; }
    }
`;
document.head.appendChild(estilo);

// Título flutuante
let titulo = document.createElement("h2");
titulo.innerText = "🕵️ Mistério na Vila: O Interrogatório Final";
titulo.style.fontFamily = "sans-serif";
titulo.style.textAlign = "center";
titulo.style.color = "#fff";
titulo.style.position = "absolute"; 
titulo.style.width = "100%";
titulo.style.top = "10px";
titulo.style.margin = "0";
titulo.style.textShadow = "2px 2px 5px rgba(0,0,0,0.9)";
titulo.style.pointerEvents = "none"; 
titulo.style.zIndex = "10"; 
document.body.appendChild(titulo);

// Configuração da Tela - Agora com 'object-fit' para não esmagar no celular!
let canvas = document.createElement("canvas");
canvas.width = 1408;  
canvas.height = 768;
canvas.style.display = "block";
canvas.style.position = "absolute"; 
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";  
canvas.style.height = "100vh"; 
canvas.style.objectFit = "contain"; // <-- MÁGICA QUE MANTÉM A PROPORÇÃO!
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

function carregarImagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}

// Arquivos 
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

let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. Viu algo estranho na noite do roubo?", resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true, pergunta2: "2. Como é o Tião?", resposta2: "Tião é trabalhador, nunca roubou.", daPista2: false },
    { nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que encontrou na casa do Tião?", resposta1: "Achei um lenço chique. Tião não usa seda... mas o Rival sim.", daPista1: true, pergunta2: "2. Tião tem inimigos?", resposta2: "Apenas o Rival. Brigaram por terras.", daPista2: false },
    { nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que o Tião fazia na hora do crime?", resposta1: "Ele estava comigo na igreja, ajudando a limpar.", daPista1: false, pergunta2: "2. O Rival tem se confessado?", resposta2: "Sim, confessou um plano contra o Tião.", daPista2: true },
    { nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, pergunta1: "1. Fique calmo, vou te tirar dessa.", resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false, pergunta2: "2. Quem te incriminou?", resposta2: "Só pode ser o engravatado do Rival!", daPista2: false },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival" }
];

let keys = {};

// Função centralizada para processar as ações (Tanto do teclado quanto do celular)
function acionarAcao(tecla) {
    if (tecla === " " && estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            estadoJogo = "DIALOGO";
            npcFoco = perto;
            textoResposta = "";
            
            if (npcFoco.tipo === "rival") {
                if (pistasColetadas >= totalPistas) {
                    textoResposta = "RIVAL: Maldição... Como você descobriu? FUI EU!";
                    setTimeout(() => { estadoJogo = "FIM"; }, 4000); 
                } else {
                    textoResposta = "RIVAL: Saia daqui! Volte quando tiver provas de verdade!";
                }
            }
        }
    } 
    else if (tecla === " " && estadoJogo === "DIALOGO" && textoResposta !== "") {
        if (estadoJogo !== "FIM") { 
            estadoJogo = "EXPLORANDO";
            npcFoco = null;
        }
    }

    if (estadoJogo === "DIALOGO" && textoResposta === "" && npcFoco.tipo !== "rival") {
        if (tecla === "1") {
            textoResposta = npcFoco.resposta1;
            if (npcFoco.daPista1 && !npcFoco.pistaColetada) { pistasColetadas++; npcFoco.pistaColetada = true; }
        }
        if (tecla === "2") {
            textoResposta = npcFoco.resposta2;
            if (npcFoco.daPista2 && !npcFoco.pistaColetada) { pistasColetadas++; npcFoco.pistaColetada = true; }
        }
    }
}

// Eventos do Teclado (PC)
window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "1", "2"].includes(e.key)) { e.preventDefault(); }
    keys[e.key] = true;
    acionarAcao(e.key);
});
window.addEventListener("keyup", (e) => keys[e.key] = false);

// --- CRIANDO OS CONTROLES MOBILE NA TELA ---
function criarBotaoMobile(txt, left, bottom, right, tamanho, tecla) {
    let btn = document.createElement("div");
    btn.className = "btn-mobile"; // Liga com o CSS lá do topo
    btn.innerText = txt;
    btn.style.position = "absolute";
    if (left !== null) btn.style.left = left;
    if (right !== null) btn.style.right = right;
    btn.style.bottom = bottom;
    btn.style.width = tamanho;
    btn.style.height = tamanho;
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    btn.style.border = "3px solid rgba(255, 255, 255, 0.6)";
    btn.style.borderRadius = "50%";
    btn.style.color = "white";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.fontSize = "26px";
    btn.style.fontWeight = "bold";
    btn.style.userSelect = "none";
    btn.style.zIndex = "100";
    btn.style.touchAction = "none"; 

    let pressionar = (e) => {
        e.preventDefault();
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
        keys[tecla] = true;
        acionarAcao(tecla);
    };
    let soltar = (e) => {
        e.preventDefault();
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        keys[tecla] = false;
    };

    btn.addEventListener("touchstart", pressionar);
    btn.addEventListener("touchend", soltar);
    btn.addEventListener("mousedown", pressionar);
    btn.addEventListener("mouseup", soltar);
    btn.addEventListener("mouseleave", soltar);

    document.body.appendChild(btn);
}

// Botões de Movimento (Esquerda)
criarBotaoMobile("↑", "90px", "160px", null, "60px", "ArrowUp");
criarBotaoMobile("↓", "90px", "20px", null, "60px", "ArrowDown");
criarBotaoMobile("←", "20px", "90px", null, "60px", "ArrowLeft");
criarBotaoMobile("→", "160px", "90px", null, "60px", "ArrowRight");

// Botões de Ação (Direita) - "A" equivale ao Espaço
criarBotaoMobile("A", null, "30px", "30px", "80px", " ");
criarBotaoMobile("1", null, "130px", "120px", "55px", "1");
criarBotaoMobile("2", null, "130px", "30px", "55px", "2");

function colidindo(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

function update() {
    if (estadoJogo === "EXPLORANDO") {
        if (keys["ArrowUp"]) detetive.y -= detetive.speed;
        if (keys["ArrowDown"]) det
