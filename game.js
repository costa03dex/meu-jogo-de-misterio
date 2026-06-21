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

// --- SISTEMA DE ÁUDIO (SONS DO JOGO) ---
// Sons gratuitos hospedados no OpenGameArt/Wikimedia para o jogo
let somPassos = new Audio("https://actions.google.com/sounds/v1/sfx/footsteps_on_cement.ogg");
somPassos.loop = true;
let somPista = new Audio("https://actions.google.com/sounds/v1/sfx/ui_click.ogg");
let somClick = new Audio("https://actions.google.com/sounds/v1/multimedia/ambient_click.ogg");

let somMusica = new Audio("https://upload.wikimedia.org/wikipedia/commons/5/5b/Suspense_Music_Loop.ogg");
somMusica.loop = true;
somMusica.volume = 0.4; // Música um pouco mais baixa para não atrapalhar

// Toca a música assim que o jogador interagir com a tela pela primeira vez
window.addEventListener("click", () => { somMusica.play().catch(() => {}); }, { once: true });
window.addEventListener("keydown", () => { somMusica.play().catch(() => {}); }, { once: true });

// Imagens 
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
let totalPistas = 4; 

// Variáveis de Efeito Máquina de Escrever
let charIndex = 0;
let textSpeed = 1.5; 

// Variáveis do Relógio/Tempo
let tempoMaximo = 180; 
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

// --- CONFIGURAÇÃO DOS PERSONAGENS ---
let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. Viu algo estranho na noite do roubo?", resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true, pergunta2: "2. Como é o Tião?", resposta2: "Tião é trabalhador, nunca roubou.", daPista2: false },
    { nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que encontrou na casa do Tião?", resposta1: "Achei uma luva de luxo perto da janela do Tião. Ele não tem dinheiro pra isso.", daPista1: true, pergunta2: "2. Tião tem inimigos?", resposta2: "Apenas o Rival. Brigaram por terras.", daPista2: false },
    { nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que o Tião fazia na hora do crime?", resposta1: "Ele estava comigo na igreja, ajudando a limpar.", daPista1: false, pergunta2: "2. O Rival tem se confessado?", resposta2: "Sim, confessou um plano terrível contra o Tião na semana passada.", daPista2: true },
    { nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, pergunta1: "1. Fique calmo, vou te tirar dessa.", resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false, pergunta2: "2. Quem te incriminou?", resposta2: "Só pode ser o engravatado do Rival!", daPista2: false },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival" }
];

// --- MAPA DE PAREDES INVISÍVEIS ---
let mostrarParedes = false; 
let paredes = [
    { x: 200, y: 150, w: 180, h: 140 },  
    { x: 1000, y: 120, w: 200, h: 140 }, 
    { x: 1100, y: 450, w: 220, h: 130 }  
];

// Itens no cenário (Inventário)
let itensCenario = [
    { nome: "Lenço de Seda", icone: "🧣", x: 850, y: 150, w: 40, h: 40, coletado: false }
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
    "Boa sorte, detetive. O trem parte em 3 minutos! Solucione o caso antes que o culpado fuja."
];
let introFase = 0;

let textosRival = [
    "Detetive, tenha dó de mim! Sou um homem muito respeitado e prestigiado nesta cidade. Passei minha vida inteira trabalhando honestamente...",
    "Mas, nos últimos dias, o presidente Jairo se voltou contra mim. Não sei o motivo, mas ele passou a me tratar com desconfiança.",
    "Eu juro pela minha honra: jamais faria uma coisa dessas com ele. Posso ter minhas diferenças, mas nunca roubarei uma relíquia de família.",
    "Peço apenas que investigue os fatos antes de me julgar. Encontre o verdadeiro culpado e prove minha inocência."
];

let textosTransicao = [
    "E agora, detetive? Todos os envolvidos parecem esconder algum segredo. A cada depoimento, novas contradições surgem...",
    "Algumas provas apontam para um suspeito, enquanto outras parecem inocentá-lo. Em quem confiar?",
    "Sua missão não será apenas encontrar o ladrão, mas separar fatos de mentiras e revelar os segredos enterrados.",
    "Quem roubou o relógio de ouro do presidente Jairo?"
];

let keys = {};

function acionarAcao(tecla) {
    if (estadoJogo === "INTRO") {
        if (tecla === " ") {
            somClick.play();
            introFase++; charIndex = 0;
            if (introFase >= textosIntro.length) estadoJogo = "EXPLORANDO";
        }
        return; 
    }

    if (estadoJogo === "RIVAL_DIALOGO") {
        if (tecla === " ") {
            somClick.play();
            if (charIndex < textosRival[falaRival].length) { charIndex = textosRival[falaRival].length; } 
            else {
                falaRival++; charIndex = 0;
                if (falaRival >= textosRival.length) { estadoJogo = "TRANSICAO_FINAL"; }
            }
        }
        return;
    }

    if (estadoJogo === "TRANSICAO_FINAL") {
        if (tecla === " ") {
            somClick.play();
            transicaoFase++; charIndex = 0;
            if (transicaoFase >= textosTransicao.length) estadoJogo = "ACUSACAO";
        }
        return;
    }

    if (estadoJogo === "ACUSACAO") {
        if (tecla === "ArrowRight") { suspeitoSelecionado = (suspeitoSelecionado + 1) % 5; somClick.play(); }
        if (tecla === "ArrowLeft") { suspeitoSelecionado = (suspeitoSelecionado - 1 + 5) % 5; somClick.play(); }
        if (tecla === " ") { somPista.play(); estadoJogo = "FIM"; }
        return;
    }

    if (tecla === " " && estadoJogo === "EXPLORANDO") {
        let hitboxInteracao = { x: detetive.x - 15, y: detetive.y - 15, w: detetive.w + 30, h: detetive.h + 30 };
        let pertoNPC = npcs.find(n => colidindo(hitboxInteracao, n));
        let pertoItem = itensCenario.find(i => colidindo(hitboxInteracao, i) && !i.coletado);

        if (pertoNPC) {
            somClick.play();
            npcFoco = pertoNPC;
            textoResposta = ""; charIndex = 0;
            
            if (npcFoco.tipo === "rival") {
                if (pistasColetadas >= totalPistas) {
                    estadoJogo = "RIVAL_DIALOGO"; falaRival = 0; charIndex = 0;
                } else {
                    estadoJogo = "DIALOGO";
                    textoResposta = "RIVAL: Saia daqui! Você ainda não achou a pista escondida no cenário e todas as provas dos moradores!";
                }
            } else {
                estadoJogo = "DIALOGO";
            }
        } else if (pertoItem) {
            somPista.play();
            pertoItem.coletado = true;
            pistasColetadas++;
            estadoJogo = "DIALOGO";
            npcFoco = { nome: "SISTEMA", tipo: "sistema" };
            textoResposta = `Você encontrou uma pista vital: ${pertoItem.nome}! Havia marcas de sapato elegante ao lado...`;
            charIndex = 0;
        }
    } 
    else if (tecla === " " && estadoJogo === "DIALOGO" && textoResposta !== "") {
        if (charIndex < textoResposta.length) {
            charIndex = textoResposta.length; 
        } else {
            somClick.play();
            estadoJogo = "EXPLORANDO"; npcFoco = null;
        }
    }

    if (estadoJogo === "DIALOGO" && textoResposta === "" && npcFoco && npcFoco.tipo !== "rival" && npcFoco.tipo !== "sistema") {
        if (tecla === "1") {
            somClick.play();
            textoResposta = npcFoco.resposta1; charIndex = 0;
            if (npcFoco.daPista1 && !npcFoco.pistaColetada) { pistasColetadas++; npcFoco.pistaColetada = true; }
        }
        if (tecla === "2") {
            somClick.play();
            textoResposta = npcFoco.resposta2; charIndex = 0;
            if (npcFoco.daPista2 && !npcFoco.pistaColetada) { pistasColetadas++; npcFoco.pistaColetada = true; }
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "1", "2"].includes(e.key)) { e.preventDefault(); }
    keys[e.key] = true;
    acionarAcao(e.key);
});
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Controles Mobile
function criarBotaoMobile(txt, left, bottom, right, tamanho, tecla) {
    let btn = document.createElement("div");
    btn.className = "btn-mobile"; 
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

    btn.addEventListener("touchstart", pressionar); btn.addEventListener("touchend", soltar);
    btn.addEventListener("mousedown", pressionar); btn.addEventListener("mouseup", soltar);
    btn.addEventListener("mouseleave", soltar); document.body.appendChild(btn);
}

criarBotaoMobile("↑", "90px", "160px", null, "60px", "ArrowUp");
criarBotaoMobile("↓", "90px", "20px", null, "60px", "ArrowDown");
criarBotaoMobile("←", "20px", "90px", null, "60px", "ArrowLeft");
criarBotaoMobile("→", "160px", "90px", null, "60px", "ArrowRight");
criarBotaoMobile("A", null, "30px", "30px", "80px", " ");
criarBotaoMobile("1", null, "130px", "120px", "55px", "1");
criarBotaoMobile("2", null, "130px", "30px", "55px", "2");

function colidindo(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words =
