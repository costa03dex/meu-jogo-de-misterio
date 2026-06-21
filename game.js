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

// O canvas ocupa a tela livremente
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

// --- SISTEMA DE ÁUDIO (ARQUIVOS LOCAIS) ---
// Certifique-se de que esses arquivos existam na mesma pasta do jogo!
let somPassos = new Audio("passos.mp3");
somPassos.loop = true;

let somPista = new Audio("pista.mp3"); 
somPista.volume = 0.6;

let somClickDialogo = new Audio("click.mp3"); 
let somMenuOpcoes = new Audio("click.mp3"); 

let musicaMisterio = new Audio("misterio.mp3");
musicaMisterio.loop = true;
musicaMisterio.volume = 0.4; 

let musicaTensa30s = new Audio("tensa.mp3"); 
musicaTensa30s.loop = true;
musicaTensa30s.volume = 0.5;

let musicaAtiva = "MISTERIO"; 

function gerenciarMusicaFundo() {
    if (tempoRestante <= 30 && tempoRestante > 0 && estadoJogo !== "INTRO" && estadoJogo !== "FIM" && estadoJogo !== "FIM_TEMPO") {
        if (musicaAtiva !== "TENSA") {
            musicaMisterio.pause();
            musicaTensa30s.currentTime = 0;
            musicaTensa30s.play().catch(() => {});
            musicaAtiva = "TENSA";
        }
    } else {
        if (musicaAtiva !== "MISTERIO" && (estadoJogo === "EXPLORANDO" || estadoJogo === "DIALOGO" || estadoJogo === "RIVAL_DIALOGO")) {
            musicaTensa30s.pause();
            musicaMisterio.play().catch(() => {});
            musicaAtiva = "MISTERIO";
        }
    }
    
    if (estadoJogo === "FIM" || estadoJogo === "FIM_TEMPO") {
        musicaMisterio.pause();
        musicaTensa30s.pause();
    }
}

function ligarMusicaInicial() {
    if (musicaAtiva === "MISTERIO" && musicaMisterio.paused && estadoJogo !== "FIM" && estadoJogo !== "FIM_TEMPO") {
        musicaMisterio.play().catch(() => {});
    }
}
window.addEventListener("click", ligarMusicaInicial, { once: true });
window.addEventListener("keydown", ligarMusicaInicial, { once: true });

// Imagens 
let mapaImg = carregarImagem("mapa.png"); 
let detetiveImg = carregarImagem("detetive.png");
let zeImg = carregarImagem("ze.png");
let mariaImg = carregarImagem("maria.png");
let padreImg = carregarImagem("padre.png");
let tiaoImg = carregarImagem("tiao.png");
let rivalImg = carregarImagem("rival.png");
let inteImg = carregarImagem("inte.png"); 

// --- VARIÁVEIS DE ESTADO ---
let estadoJogo = "INTRO"; 
let npcFoco = null; 
let textoResposta = ""; 
let pistasColetadas = 0;
let totalPistas = 4; 

// --- CADERNO DO DETETIVE ---
let cadernoAberto = false;
let anotacoes = [];

let charIndex = 0;
let textSpeed = 1.5; 

let tempoMaximo = 180; 
let tempoRestante = tempoMaximo;

let timerJogo = setInterval(() => {
    if (!cadernoAberto && (estadoJogo === "EXPLORANDO" || estadoJogo === "DIALOGO" || estadoJogo === "RIVAL_DIALOGO")) {
        if (tempoRestante > 0) {
            tempoRestante--;
            gerenciarMusicaFundo(); 
        } else {
            estadoJogo = "FIM_TEMPO";
            gerenciarMusicaFundo();
        }
    }
}, 1000);

// --- PERSONAGENS ---
let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. Viu algo estranho na noite do roubo?", resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true, textoPista1: "Rival foi visto correndo para a mata com um saco suspeito.", pergunta2: "2. Como é o Tião?", resposta2: "Tião é trabalhador, nunca roubou.", daPista2: false },
    { nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que encontrou na casa do Tião?", resposta1: "Achei uma luva de luxo perto da janela do Tião. Ele não tem dinheiro pra isso.", daPista1: true, textoPista1: "Luva de luxo encontrada perto da casa do Tião.", pergunta2: "2. Tião tem inimigos?", resposta2: "Apenas o Rival. Brigaram por terras.", daPista2: false },
    { nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que o Tião fazia na hora do crime?", resposta1: "Ele estava comigo na igreja, ajudando a limpar.", daPista1: false, pergunta2: "2. O Rival tem se confessado?", resposta2: "Sim, confessou um plano terrível contra o Tião na semana passada.", daPista2: true, textoPista2: "Padre revelou que o Rival armou um plano contra Tião." },
    { nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, pergunta1: "1. Fique calmo, vou te tirar dessa.", resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false, pergunta2: "2. Quem te incriminou?", resposta2: "Só pode ser o engravatado do Rival!", daPista2: false },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival", pistaColetada: false, pergunta1: "1. ESTOU PRONTO PARA ACUSAR ALGUÉM", resposta1: "", daPista1: false, pergunta2: "2. Ainda estou investigando (Sair)", resposta2: "Então não me faça perder tempo com suas presenças insolentes!", daPista2: false }
];

let itensCenario = [
    { nome: "Lenço de Seda", icone: "🧣", x: 850, y: 150, w: 40, h: 40, coletado: false, textoPista: "Lenço de seda sujo de barro com marcas de sapato caro ao lado." }
];

let falaRival = 0;
let transicaoFase = 0;
let suspeitoSelecionado = 0; 
let suspeitosNomes = ["Rival", "Tião", "Padre", "Seu Zé", "Dona Maria"];

// Textos
let textosIntro = [
    "Em um dia aparentemente comum na pequena cidade da roça, um grande crime abalou a tranquilidade dos moradores. No alto do morro, na casa mais luxuosa da região, vivia o respeitado presidente Jairo. Entre seus bens mais valiosos estava um relógio de ouro raro.",
    "Mas, ao amanhecer, uma notícia chocante se espalhou pela cidade: o relógio havia sido roubado!",
    "O desaparecimento da preciosa herança gerou medo, dúvidas e muitas suspeitas. Entre os moradores, um nome logo começou a ser comentado: Tião.",
    "Sua missão será investigar as pistas, interrogar os suspeitos, descobrir o verdadeiro ladrão e provar se Tião é culpado ou inocente.",
    "Boa sorte, detetive. O trem parte em 3 minutos! Solucione o caso antes que o culpado fuja."
];
let introFase = 0;

let textosRival = [
    "Detetive, tenha dó de mim! Sou um homem muito respeitado e prestigiado nesta cidade...",
    "Mas, nos últimos dias, o presidente Jairo se voltou contra mim. Não sei o motivo, mas ele passou a me tratar com desconfiança.",
    "Eu juro pela minha honra: jamais faria uma coisa dessas com ele. Posso ter minhas diferenças, mas nunca roubarei uma relíquia de família.",
    "Peço apenas que investigue os fatos antes de me julgar. Encontre o verdadeiro culpado e prove minha inocência."
];

let textosTransicao = [
    "E agora, detetive? Todos os envolvidos parecem esconder algum segredo.",
    "Algumas provas apontam para um suspeito, enquanto outras parecem inocentá-lo. Em quem confiar?",
    "Quem roubou o relógio de ouro do presidente Jairo?"
];

let keys = {};

function acionarAcao(tecla) {
    if (estadoJogo === "INTRO") {
        if (tecla === " ") {
            somClickDialogo.play().catch(()=>{}); 
            introFase++; charIndex = 0;
            if (introFase >= textosIntro.length) estadoJogo = "EXPLORANDO";
        }
        return; 
    }

    if (tecla.toLowerCase() === "c") {
        if (estadoJogo === "EXPLORANDO" || cadernoAberto) {
            somMenuOpcoes.play().catch(()=>{}); 
            cadernoAberto = !cadernoAberto;
            return;
        }
    }
    
    if (cadernoAberto) {
        if (tecla === " ") { 
            somMenuOpcoes.play().catch(()=>{});
            cadernoAberto = false;
        }
        return; 
    }

    if (estadoJogo === "RIVAL_DIALOGO") {
        if (tecla === " ") {
            somClickDialogo.play().catch(()=>{}); 
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
            somClickDialogo.play().catch(()=>{});
            transicaoFase++; charIndex = 0;
            if (transicaoFase >= textosTransicao.length) estadoJogo = "ACUSACAO";
        }
        return;
    }

    if (estadoJogo === "ACUSACAO") {
        if (tecla === "ArrowRight") { suspeitoSelecionado = (suspeitoSelecionado + 1) % 5; somMenuOpcoes.play().catch(()=>{}); }
        if (tecla === "ArrowLeft") { suspeitoSelecionado = (suspeitoSelecionado - 1 + 5) % 5; somMenuOpcoes.play().catch(()=>{}); }
        if (tecla === " ") { somPista.play().catch(()=>{}); estadoJogo = "FIM"; gerenciarMusicaFundo(); }
        return;
    }

    if (tecla === " " && estadoJogo === "EXPLORANDO") {
        let hitboxInteracao = { x: detetive.x - 25, y: detetive.y - 25, w: detetive.w + 50, h: detetive.h + 50 };
        let pertoNPC = npcs.find(n => colidindo(hitboxInteracao, n));
        let pertoItem = itensCenario.find(i => colidindo(hitboxInteracao, i) && !i.coletado);

        if (pertoNPC) {
            somClickDialogo.play().catch(()=>{}); 
            npcFoco = pertoNPC;
            textoResposta = ""; charIndex = 0;
            estadoJogo = "DIALOGO";
        } else if (pertoItem) {
            somPista.play().catch(()=>{}); 
            pertoItem.coletado = true;
            pistasColetadas++;
            anotacoes.push(pertoItem.textoPista); 
            estadoJogo = "DIALOGO";
            npcFoco = { nome: "NOVA ANOTAÇÃO", tipo: "sistema" };
            textoResposta = `Você anotou uma pista no caderno! Aperte C para ler.`;
            charIndex = 0;
        }
    } 
    else if (tecla === " " && estadoJogo === "DIALOGO" && textoResposta !== "") {
        if (charIndex < textoResposta.length) {
            charIndex = textoResposta.length; 
        } else {
            somClickDialogo.play().catch(()=>{}); 
            estadoJogo = "EXPLORANDO"; npcFoco = null;
        }
    }

    if (estadoJogo === "DIALOGO" && textoResposta === "" && npcFoco && npcFoco.tipo !== "sistema") {
        if (tecla === "1") {
            somMenuOpcoes.play().catch(()=>{}); 
            if (npcFoco.tipo === "rival") {
                estadoJogo = "RIVAL_DIALOGO"; falaRival = 0; charIndex = 0;
            } else {
                textoResposta = npcFoco.resposta1; charIndex = 0;
                if (npcFoco.daPista1 && !npcFoco.pistaColetada) { 
                    somPista.play().catch(()=>{}); 
                    pistasColetadas++; 
                    npcFoco.pistaColetada = true; 
                    if (npcFoco.textoPista1) anotacoes.push(npcFoco.textoPista1);
                }
            }
        }
        if (tecla === "2") {
            somMenuOpcoes.play().catch(()=>{}); 
            textoResposta = npcFoco.resposta2; charIndex = 0;
            if (npcFoco.daPista2 && !npcFoco.pistaColetada) { 
                somPista.play().catch(()=>{}); 
                pistasColetadas++; 
                npcFoco.pistaColetada = true; 
                if (npcFoco.textoPista2) anotacoes.push(npcFoco.textoPista2);
            }
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "1", "2", "c", "C"].includes(e.key)) { e.preventDefault(); }
    keys[e.key] = true;
    acionarAcao(e.key);
});
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Controles Mobile
function criarBotaoMobile(txt, props, tecla) {
    let btn = document.createElement("div");
    btn.className = "btn-mobile"; 
    btn.innerText = txt;
    btn.style.position = "absolute";
    
    if (props.left !== undefined) btn.style.left = props.left;
    if (props.right !== undefined) btn.style.right = props.right;
    if (props.bottom !== undefined) btn.style.bottom = props.bottom;
    if (props.top !== undefined) btn.style.top = props.top;
    
    btn.style.width = props.size || "60px";
    btn.style.height = props.size || "60px";
    
    btn.style.backgroundColor = props.bg || "rgba(255, 255, 255, 0.2)";
    btn.style.border = "3px solid rgba(255, 255, 255, 0.6)";
    btn.style.borderRadius = "50%";
    btn.style.color = "white";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.fontSize = props.fontSize || "26px";
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
        btn.style.backgroundColor = props.bg || "rgba(255, 255, 255, 0.2)";
        keys[tecla] = false;
    };

    btn.addEventListener("touchstart", pressionar); btn.addEventListener("touchend", soltar);
    btn.addEventListener("mousedown", pressionar); btn.addEventListener("mouseup", soltar);
    btn.addEventListener("mouseleave", soltar); document.body.appendChild(btn);
}

criarBotaoMobile("↑", {left: "90px", bottom: "160px", size: "60px"}, "ArrowUp");
criarBotaoMobile("↓", {left: "90px", bottom: "20px", size: "60px"}, "ArrowDown");
criarBotaoMobile("←", {left: "20px", bottom: "90px", size: "60px"}, "ArrowLeft");
criarBotaoMobile("→", {left: "160px", bottom: "90px", size: "60px"}, "ArrowRight");
criarBotaoMobile("A", {right: "30px", bottom: "30px", size: "80px"}, " ");
criarBotaoMobile("1", {right: "120px", bottom: "130px", size: "55px"}, "1");
criarBotaoMobile("2", {right: "30px", bottom: "130px", size: "55px"}, "2");
criarBotaoMobile("📓", {right: "20px", top: "20px", size: "65px", fontSize: "30px", bg: "rgba(100, 255, 218, 0.3)"}, "c");

function colidindo(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' '); let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '; let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y); line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    context.fillText(line, x, y);
}

function formatarTempo(segundos) {
    let m = Math.floor(segundos / 60);
    let s = segundos % 60;
    return `${m < 10 ? '0':''}${m}:${s < 10 ? '0':''}${s}`;
}

function update() {
    if (estadoJogo === "EXPLORANDO" && !cadernoAberto) {
        let andando = keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"];
        
        if (andando) {
            if (somPassos.paused) somPassos.play().catch(() => {});
        } else {
            somPassos.pause();
        }

        if (keys["ArrowUp"]) detetive.y -= detetive.speed;
        if (keys["ArrowDown"]) detetive.y += detetive.speed;
        if (keys["ArrowLeft"]) detetive.x -= detetive.speed;
        if (keys["ArrowRight"]) detetive.x += detetive.speed;

        if (detetive.x < 0) detetive.x = 0;
        if (detetive.y < 0) detetive.y = 0;
        if (detetive.x + detetive.w > canvas.width) detetive.x = canvas.width - detetive.w;
        if (detetive.y + detetive.h > canvas.height) detetive.y = canvas.height - detetive.h;
    } else {
        somPassos.pause(); 
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === "INTRO" || estadoJogo === "TRANSICAO_FINAL") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "32px Arial";
        
        let txtOriginal = estadoJogo === "INTRO" ? textosIntro[introFase] : textosTransicao[transicaoFase];
        if (charIndex < txtOriginal.length) charIndex += textSpeed;
        let textoParcial = txtOriginal.substring(0, Math.floor(charIndex));

        wrapText(ctx, textoParcial, canvas.width / 2, canvas.height / 2 - 60, 1000, 45);
        
        ctx.fillStyle = "#64ffda"; ctx.font = "20px Arial";
        ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", canvas.width / 2, canvas.height - 80);
        ctx.textAlign = "left"; 
        requestAnimationFrame(gameLoop); return; 
    }

    if (estadoJogo === "FIM_TEMPO") {
        ctx.fillStyle = "rgba(10, 0, 0, 0.98)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff4444"; ctx.textAlign = "center"; ctx.font = "bold 70px sans-serif";
        ctx.fillText("⏳ TEMPO ESGOTADO!", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillStyle = "white"; ctx.font = "26px sans-serif";
        ctx.fillText("O trem das 18h partiu. O culpado conseguiu fugir da cidade...", canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 20px sans-serif";
        ctx.fillText(">> Atualize a página para tentar novamente <<", canvas.width / 2, canvas.height / 2 + 100);
        ctx.textAlign = "left"; 
        requestAnimationFrame(gameLoop); return;
    }

    if (estadoJogo === "ACUSACAO") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (inteImg.complete && inteImg.naturalWidth > 0) {
            let imgW = 800; let imgH = 450; 
            let startX = (canvas.width - imgW) / 2; let startY = (canvas.height - imgH) / 2 - 40;
            ctx.drawImage(inteImg, startX, startY, imgW, imgH);
            let charW = imgW / 5; let selX = startX + (suspeitoSelecionado * charW);
            ctx.strokeStyle = "red"; ctx.lineWidth = 6; ctx.strokeRect(selX, startY, charW, imgH);
            
            ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "bold 40px Arial";
            ctx.fillText("QUEM É O CULPADO?", canvas.width / 2, 100);
            ctx.fillStyle = "#ffe600"; ctx.font = "bold 32px Arial";
            ctx.fillText("Acusar: " + suspeitosNomes[suspeitoSelecionado], canvas.width / 2, startY + imgH + 60);
            ctx.fillStyle = "#64ffda"; ctx.font = "22px Arial";
            ctx.fillText("Use SETAS para escolher e A/ESPAÇO para confirmar", canvas.width / 2, startY + imgH + 110);
        }
        ctx.textAlign = "left"; requestAnimationFrame(gameLoop); return;
    }

    if (mapaImg.complete && mapaImg.naturalWidth > 0) {
        ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#333"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (let item of itensCenario) {
        if (!item.coletado) {
            ctx.fillStyle = "gold"; ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "black"; ctx.font = "bold 24px Arial"; ctx.fillText("?", item.x + 13, item.y + 28);
        }
    }

    for (let npc of npcs) {
        if (npc.img.complete && npc.img.naturalWidth > 0) { ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h); }
        if (npc.tipo === "testemunha" && !npc.pistaColetada) {
            ctx.fillStyle = "yellow"; ctx.font = "bold 35px Arial"; ctx.fillText("!", npc.x + 35, npc.y - 5);
        }
    }

    if (detetiveImg.complete && detetiveImg.naturalWidth > 0) {
        ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.w, detetive.h);
    }

    // --- LANTERNA ---
    ctx.save();
    let lanternaCanvas = document.createElement('canvas');
    lanternaCanvas.width = canvas.width; lanternaCanvas.height = canvas.height;
    let lCtx = lanternaCanvas.getContext('2d');
    lCtx.fillStyle = "rgba(0, 0, 0, 0.75)"; lCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    lCtx.globalCompositeOperation = 'destination-out';
    let raioLanterna = 190; 
    let centroX = detetive.x + detetive.w / 2;
    let centroY = detetive.y + detetive.h / 2;
    
    let gradiente = lCtx.createRadialGradient(centroX, centroY, 50, centroX, centroY, raioLanterna);
    gradiente.addColorStop(0, 'rgba(0,0,0,1)');
    gradiente.addColorStop(1, 'rgba(0,0,0,0)');
    lCtx.fillStyle = gradiente; lCtx.beginPath();
    lCtx.arc(centroX, centroY, raioLanterna, 0, Math.PI * 2); lCtx.fill();
    
    ctx.drawImage(lanternaCanvas, 0, 0);
    ctx.restore();

    if (estadoJogo === "EXPLORANDO" && !cadernoAberto) {
        let hitboxInteracao = { x: detetive.x - 25, y: detetive.y - 25, w: detetive.w + 50, h: detetive.h + 50 };
        let pertoNPC = npcs.find(n => colidindo(hitboxInteracao, n));
        let pertoItem = itensCenario.find(i => colidindo(hitboxInteracao, i) && !i.coletado);
        
        if (pertoNPC || pertoItem) {
            ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(detetive.x - 20, detetive.y - 45, 130, 30);
            ctx.fillStyle = "white"; ctx.font = "bold 13px sans-serif"; ctx.fillText("Botão A / ESPAÇO", detetive.x - 12, detetive.y - 25);
        }
    }

    // HUD: Contador Provas
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(20, 20, 200, 45); 
    ctx.strokeStyle = "#64ffda"; ctx.lineWidth = 2; ctx.strokeRect(20, 20, 200, 45);
    ctx.fillStyle = "#64ffda"; ctx.font = "bold 18px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " / " + totalPistas, 45, 48);

    // HUD: Dica
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(235, 20, 280, 45);
    ctx.strokeStyle = "#ffe600"; ctx.lineWidth = 2; ctx.strokeRect(235, 20, 280, 45);
    ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif"; 
    ctx.fillText("📓 Aperte [ C ] para o Caderno", 255, 48);

    // HUD: Relógio
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(canvas.width - 220, 20, 180, 45);
    let corTempo = tempoRestante <= 30 ? "#ff4444" : "#64ffda";
    ctx.strokeStyle = corTempo; ctx.lineWidth = 2; ctx.strokeRect(canvas.width - 220, 20, 180, 45);
    ctx.fillStyle = corTempo; ctx.font = "bold 20px Arial";
    ctx.fillText("⏳ Tempo: " + formatarTempo(tempoRestante), canvas.width - 200, 48);

    // --- TELA DO CADERNO ---
    if (cadernoAberto) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let cX = canvas.width / 2 - 350;
        let cY = 100;
        
        ctx.fillStyle = "#fef3c7"; ctx.fillRect(cX, cY, 700, 500);
        ctx.strokeStyle = "#8b5a2b"; ctx.lineWidth = 6; ctx.strokeRect(cX, cY, 700, 500);

        ctx.fillStyle = "#8b5a2b"; ctx.fillRect(cX, cY, 40, 500);
        for(let i=0; i<10; i++) {
            ctx.fillStyle = "white"; ctx.beginPath();
            ctx.arc(cX + 20, cY + 40 + (i*45), 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath();
            ctx.arc(cX + 20, cY + 40 + (i*45), 10, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.fillStyle = "black"; ctx.font = "bold 32px Arial"; ctx.fillText("📓 Caderno de Anotações", cX + 60, cY + 50);
        ctx.fillRect(cX + 60, cY + 65, 600, 2);

        ctx.font = "20px Arial"; let yPista = cY + 110;
        
        if (anotacoes.length === 0) {
            ctx.fillStyle = "#555"; ctx.fillText("Nenhuma pista anotada ainda. Investigue a cidade!", cX + 60, yPista);
        } else {
            ctx.fillStyle = "#1e293b";
            for (let i = 0; i < anotacoes.length; i++) {
                ctx.fillText("•", cX + 60, yPista); wrapText(ctx, anotacoes[i], cX + 80, yPista, 560, 28); yPista += 60; 
            }
        }
        ctx.fillStyle = "#555"; ctx.font = "italic 18px Arial"; ctx.fillText("[ Aperte C ou ESPAÇO para fechar ]", cX + 60, cY + 470);
    }

    // Diálogos Gerais
    if (estadoJogo === "DIALOGO" && !cadernoAberto) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.strokeStyle = npcFoco.tipo === "sistema" ? "#ffe600" : "#64ffda"; ctx.lineWidth = 4; ctx.strokeRect(154, 540, 1100, 180);
        ctx.fillStyle = npcFoco.tipo === "sistema" ? "#ffe600" : "#64ffda"; ctx.font = "bold 26px Arial"; ctx.fillText(npcFoco.nome + ":", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";

        if (textoResposta !== "") {
            if (charIndex < textoResposta.length) charIndex += textSpeed;
            let msgParcial = textoResposta.substring(0, Math.floor(charIndex));
            wrapText(ctx, msgParcial, 190, 635, 1000, 30);
            if (charIndex >= textoResposta.length) {
                ctx.fillStyle = "#94a3b8"; ctx.font = "16px Arial"; ctx.fillText("[ Aperte A (ou ESPAÇO) para fechar ]", 190, 700);
            }
        } else if (npcFoco.tipo !== "sistema") {
            ctx.fillStyle = "#e2e8f0"; ctx.fillText("Escolha o que perguntar (botões 1 ou 2):", 190, 625);
            ctx.fillStyle = npcFoco.tipo === "rival" ? "#ff4444" : "#64ffda"; 
            ctx.fillText(npcFoco.pergunta1, 210, 665); 
            ctx.fillText(npcFoco.pergunta2, 210, 695);
        }
    }

    // Diálogo Exclusivo do Rival
    if (estadoJogo === "RIVAL_DIALOGO" && !cadernoAberto) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 4; ctx.strokeRect(154, 540, 1100, 180);
        ctx.fillStyle = "#ff4444"; ctx.font = "bold 26px Arial"; ctx.fillText("Rival:", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";
        
        let txtOriginal = textosRival[falaRival];
        if (charIndex < txtOriginal.length) charIndex += textSpeed;
        wrapText(ctx, txtOriginal.substring(0, Math.floor(charIndex)), 190, 625, 1000, 30);
        
        if (charIndex >= txtOriginal.length) {
            ctx.fillStyle = "#94a3b8"; ctx.font = "16px Arial"; ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", 190, 700);
        }
    }

    // TELA DE FINAIS
    if (estadoJogo === "FIM") {
        ctx.fillStyle = "rgba(0, 15, 5, 0.95)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center"; 
        
        if (suspeitoSelecionado === 0 && pistasColetadas >= totalPistas) { 
            ctx.fillStyle = "#ffe600"; ctx.font = "bold 65px sans-serif"; ctx.fillText("🏆 FINAL VERDADEIRO", canvas.width / 2, canvas.height / 2 - 40);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Com todas as provas, você expôs as mentiras do Rival!", canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText("Ele confessou o crime e Tião foi inocentado!", canvas.width / 2, canvas.height / 2 + 60);
        } else if (suspeitoSelecionado === 0 && pistasColetadas < totalPistas) {
            ctx.fillStyle = "#a8a8a8"; ctx.font = "bold 65px sans-serif"; ctx.fillText("⚖️ FINAL NEUTRO", canvas.width / 2, canvas.height / 2 - 40);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Você deduziu que o Rival era o culpado, mas acusou sem reunir todas as provas.", canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText("Os advogados dele o livraram e o caso foi encerrado sem prisões.", canvas.width / 2, canvas.height / 2 + 60);
        } else if (suspeitoSelecionado === 2) {
            ctx.fillStyle = "#b5179e"; ctx.font = "bold 65px sans-serif"; ctx.fillText("🤫 FINAL SECRETO", canvas.width / 2, canvas.height / 2 - 40);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Você apontou para o Padre! Todos ficaram em choque com a acusação...", canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText("Chorando, ele confessou que roubou o relógio para pagar as dívidas da igreja!", canvas.width / 2, canvas.height / 2 + 60);
        } else {
            ctx.fillStyle = "#ff4444"; ctx.font = "bold 65px sans-serif"; ctx.fillText("❌ FINAL RUIM", canvas.width / 2, canvas.height / 2 - 40);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Você acusou " + suspeitosNomes[suspeitoSelecionado] + ", que não cometeu o crime!", canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText("Enquanto um inocente foi preso, o verdadeiro culpado fugiu com a relíquia...", canvas.width / 2, canvas.height / 2 + 60);
        }
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 20px sans-serif"; ctx.fillText(">> Atualize a página para jogar novamente <<", canvas.width / 2, canvas.height / 2 + 150);
        ctx.textAlign = "left"; 
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() { update(); draw(); }
gameLoop();
