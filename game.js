// Limpa a tela, força o Fullscreen e adiciona estilos
document.body.innerHTML = "";
document.body.style.margin = "0"; 
document.body.style.padding = "0"; 
document.body.style.overflow = "hidden"; 
document.body.style.backgroundColor = "#222"; 

// --- DETECTOR DE CELULAR ---
let estilo = document.createElement("style");
estilo.innerHTML = `
    .btn-mobile { display: none; }
    @media (max-width: 1024px), (pointer: coarse) {
        .btn-mobile { display: flex !important; }
    }
`;
document.head.appendChild(estilo);

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

let canvas = document.createElement("canvas");
canvas.width = 1408;  
canvas.height = 768;
canvas.style.display = "block";
canvas.style.position = "absolute"; 
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";  
canvas.style.height = "100vh"; 
canvas.style.objectFit = "contain"; 
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
let inteImg = carregarImagem("inte.png"); 

// --- VARIÁVEIS DE ESTADO E HISTÓRIA ---
let estadoJogo = "INTRO"; 
let npcFoco = null; 
let textoResposta = ""; 
let pistasColetadas = 0;
let totalPistas = 4; // 3 NPCs + 1 Item Secreto no Chão

// Variáveis de Efeito Máquina de Escrever
let charIndex = 0;
let textSpeed = 1.5; 

// Variáveis do Relógio/Tempo
let tempoMaximo = 180; // 3 minutos
let tempoRestante = tempoMaximo;

let timerJogo = setInterval(() => {
    if (estadoJogo === "EXPLORANDO" || estadoJogo === "DIALOGO" || estadoJogo === "RIVAL_DIALOGO") {
        if (tempoRestante > 0) {
            tempoRestante--;
        } else {
            estadoJogo = "FIM_TEMPO";
        }
    }
}, 1000);

// --- SISTEMA DE COLISÕES (PAREDES INVISÍVEIS) ---
// Modifique o x, y, w, h abaixo para cercar as casas do seu mapa!
let mostrarParedes = true; // Mude para false para esconder as caixas vermelhas depois de ajustar!
let paredes = [
    { x: 200, y: 150, w: 180, h: 140 }, // Exemplo: Perto do Seu Zé
    { x: 1000, y: 120, w: 200, h: 140 }, // Exemplo: Perto do Padre
    { x: 1100, y: 450, w: 220, h: 130 }  // Exemplo: Perto da Dona Maria
];

// Itens no cenário
let itensCenario = [
    { nome: "Lenço de Seda Manchado", x: 850, y: 150, w: 40, h: 40, coletado: false }
];

// Variáveis para a Acusação Final
let falaRival = 0;
let transicaoFase = 0;
let suspeitoSelecionado = 0; 
let suspeitosNomes = ["Rival", "Tião", "Padre", "Seu Zé", "Dona Maria"];

// Textos
let textosIntro = [
    "Em um dia aparentemente comum na pequena cidade da roça, um grande crime abalou a tranquilidade dos moradores. No alto do morro, na casa mais luxuosa da região, vivia o respeitado presidente Jairo. Entre seus bens mais valiosos estava um relógio de ouro raro, uma relíquia de família passada de geração em geração durante décadas.",
    "Mas, ao amanhecer, uma notícia chocante se espalhou pela cidade: o relógio havia sido roubado!",
    "O desaparecimento da preciosa herança gerou medo, dúvidas e muitas suspeitas. Entre os moradores, um nome logo começou a ser comentado: Tião. Mas será que ele é realmente o culpado ou está sendo acusado injustamente?",
    "Diante desse mistério, precisamos da ajuda do melhor detetive da região. E esse detetive é você!",
    "Sua missão será investigar as pistas, interrogar os suspeitos, descobrir o verdadeiro ladrão e, acima de tudo, provar se Tião é culpado ou inocente.",
    "Boa sorte, detet
