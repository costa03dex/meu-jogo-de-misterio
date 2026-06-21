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

// --- SISTEMA DE ÁUDIO ---
let somPassos = new Audio("https://actions.google.com/sounds/v1/sfx/footsteps_on_cement.ogg");
somPassos.loop = true;
let somPista = new Audio("https://actions.google.com/sounds/v1/sfx/ui_click.ogg");
let somClick = new Audio("https://actions.google.com/sounds/v1/multimedia/ambient_click.ogg");
let somAlerta = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");

let somMusica = new Audio("https://upload.wikimedia.org/wikipedia/commons/5/5b/Suspense_Music_Loop.ogg");
somMusica.loop = true;
somMusica.volume = 0.4; 

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

// --- VARIÁVEIS DE ESTADO ---
let estadoJogo = "INTRO"; 
let npcFoco = null; 
let textoResposta = ""; 
let pistasColetadas = 0;
let totalPistas = 4; 

let charIndex = 0;
let textSpeed = 1.5; 

let tempoMaximo = 180; 
let tempoRestante = tempoMaximo;
let avisoFugaRival = false;
let avisoTrem = false;

// --- 10. MELHORIA: SISTEMA DE PISTAS ALEATÓRIAS E CULPADO VARIÁVEL ---
let locaisPossiveis = [
    { x: 850, y: 150, nomeLocal: "perto da Igreja" },
    { x: 500, y: 220, nomeLocal: "atrás do celeiro" },
    { x: 900, y: 650, nomeLocal: "perto da mata sul" },
    { x: 400, y: 500, nomeLocal: "perto da entrada da vila" }
];
let localEscolhido = locaisPossiveis[Math.floor(Math.random() * locaisPossiveis.length)];

// Sorteia quem é o verdadeiro culpado da rodada (Pode ser o Rival ou o Seu Zé)
let culpadoVerdadeiro = Math.random() > 0.5 ? "Rival" : "Seu Zé";

// --- 2. CADERNO DO DETETIVE E 7. INVENTÁRIO DE PROVAS ---
let cadernoAnotacoes = [];
let inventarioProvas = [];

let itensCenario = [
    { nome: "Lenço de Seda", icone: "🧣", x: localEscolhido.x, y: localEscolhido.y, w: 40, h: 40, coletado: false }
];

let timerJogo = setInterval(() => {
    if (estadoJogo === "EXPLORANDO" || estadoJogo === "DIALOGO" || estadoJogo === "RIVAL_DIALOGO") {
        if (tempoRestante > 0) {
            tempoRestante--;
            // 6. CONSEQUÊNCIAS DO TEMPO
            if (tempoRestante === 120 && !avisoFugaRival) {
                avisoFugaRival = true;
                somAlerta.play().catch(() => {});
            }
            if (tempoRestante === 60 && !avisoTrem) {
                avisoTrem = true;
                somAlerta.play().catch(() => {});
            }
        } else {
            estadoJogo = "FIM_TEMPO";
        }
    }
}, 1000);

// --- 5. NPCs MENTIROSOS E AJUSTE DE DIÁLOGOS ---
let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { 
        nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, 
        pergunta1: "1. Viu algo estranho na noite do roubo?", 
        resposta1: culpadoVerdadeiro === "Rival" ? "Vi o Rival correndo pra mata com um saco de moedas!" : "Eu estava dormindo, não vi absolutamente nada na vila...", 
        daPista1: culpadoVerdadeiro === "Rival", 
        pergunta2: "2. Onde você estava à meia-noite?", 
        resposta2: culpadoVerdadeiro === "Seu Zé" ? "Na minha casa uai... (Ele parece nervoso e desvia o olhar)" : "Estava limpando minhas ferramentas de trabalho.", 
        daPista2: culpadoVerdadeiro === "Seu Zé" 
    },
    { 
        nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, 
        pergunta1: "1. O que encontrou perto da janela?", 
        resposta1: "Achei uma luva de luxo jogada na janela do Tião. Mas o Tião não tem dinheiro pra comprar isso!", 
        daPista1: true, 
        pergunta2: "2. O Rival costuma andar por aqui?", 
        resposta2: "Aquele engravatado vive rondando as casas à noite prometendo comprar terras.", 
        daPista2: false 
    },
    { 
        nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, 
        pergunta1: "1. Onde o Tião estava no horário do crime?", 
        resposta1: "O Tião estava comigo na paróquia até tarde, me ajudando a organizar os dízimos.", 
        daPista1: true, 
        pergunta2: "2. Alguém agia de forma suspeita?", 
        resposta2: culpadoVerdadeiro === "Seu Zé" ? "Seu Zé andou me perguntando quanto valia ouro purificado dias atrás..." : "O Rival comprou um cadeado idêntico ao da mansão na semana passada.", 
        daPista2: true 
    },
    { 
        nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, 
        pergunta1: "1. Eles acham que foi você.", 
        resposta1: "Estão tentando me armar uma cilada, seu detetive! Sou inocente!", 
        daPista1: false, 
        pergunta2: "2. Quem faria isso?", 
        resposta2: "Alguém quer me ver expulso dessas terras de qualquer jeito.", 
        daPista2: false 
    },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival" }
];

let falaRival = 0;
let transicaoFase = 0;
let suspeitoSelecionado = 0; 
let suspeitosNomes = ["Rival", "Tião", "Padre", "Seu Zé", "Dona Maria"];

// Textos
let textosIntro = [
    "Um grande crime abalou a tranquilidade dos moradores: o relógio de ouro do presidente Jairo foi roubado!",
    "As suspeitas caíram sobre Tião, mas pistas falsas e depoimentos contraditórios cercam a vila.",
    "Investigue os cenários, colete os testemunhos e atualize seu caderno para descobrir o verdadeiro culpado.",
    "Boa sorte. O trem parte em 3 minutos!"
];
let introFase = 0;

let textosRival = [
    "Detetive, você realmente acha que fui eu? Tenho negócios importantes a tratar!",
    "Minhas intenções na vila são puramente comerciais. Jamais me rebaixaria a um furto doméstico.",
    "Pense bem antes de fazer sua escolha no interrogatório final."
];

let textosTransicao = [
    "A hora da verdade chegou. Quem está falando a verdade e quem plantou as provas?",
    "Consulte suas anotações antes de dar o veredito final."
];

let keys = {};

function registrarAnotacao(titulo, detalhe) {
    if (!cadernoAnotacoes.includes(detalhe)) {
        cadernoAnotacoes.push(detalhe);
        inventarioProvas.push("✓ " + titulo);
    }
}

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
                if (falaRival >= textosRival.length) { estadoJogo = "CONFIRMACAO_FINAL"; }
            }
        }
        return;
    }

    if (estadoJogo === "CONFIRMACAO_FINAL") {
        if (tecla === " ") {
            somClick.play();
            estadoJogo = "TRANSICAO_FINAL";
            charIndex = 0;
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
        let hitboxInteracao = { x: detetive.x - 25, y: detetive.y - 25, w: detetive.w + 50, h: detetive.h + 50 };
        let pertoNPC = npcs.find(n => colidindo(hitboxInteracao, n));
        let pertoItem = itensCenario.find(i => colidindo(hitboxInteracao, i) && !i.coletado);

        if (pertoNPC) {
            somClick.play();
            npcFoco = pertoNPC;
            textoResposta = ""; charIndex = 0;
            
            if (npcFoco.tipo === "rival") {
                // Permite ir para a acusação a qualquer momento para testar os múltiplos finais
                estadoJogo = "RIVAL_DIALOGO"; falaRival = 0; charIndex = 0;
            } else {
                estadoJogo = "DIALOGO";
            }
        } else if (pertoItem) {
            somPista.play();
            pertoItem.coletado = true;
            pistasColetadas++;
            registrarAnotacao("Lenço de Seda", `Lenço de luxo achado ${localEscolhido.nomeLocal}.`);
            estadoJogo = "DIALOGO";
            npcFoco = { nome: "CADERNO DO DETETIVE", tipo: "sistema" };
            textoResposta = `Item coletado e anotado: Pista encontrada ${localEscolhido.nomeLocal}.`;
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
            registrarAnotacao("Depoimento de " + npcFoco.nome, npcFoco.nome + ": " + npcFoco.resposta1);
        }
        if (tecla === "2") {
            somClick.play();
            textoResposta = npcFoco.resposta2; charIndex = 0;
            if (npcFoco.daPista2 && !npcFoco.pistaColetada) { pistasColetadas++; npcFoco.pistaColetada = true; }
            registrarAnotacao("Testemunho de " + npcFoco.nome, npcFoco.nome + ": " + npcFoco.resposta2);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === "INTRO" || estadoJogo === "TRANSICAO_FINAL") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "32px Arial";
        let txtOriginal = estadoJogo === "INTRO" ? textosIntro[introFase] : textosTransicao[transicaoFase];
        if (charIndex < txtOriginal.length) charIndex += textSpeed;
        wrapText(ctx, txtOriginal.substring(0, Math.floor(charIndex)), canvas.width / 2, canvas.height / 2 - 60, 1000, 45);
        ctx.fillStyle = "#64ffda"; ctx.font = "20px Arial";
        ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", canvas.width / 2, canvas.height - 80);
        ctx.textAlign = "left"; requestAnimationFrame(gameLoop); return; 
    }

    // 8. MELHORAR A ACUSAÇÃO FINAL (TELA DE CONFIRMAÇÃO DETALHADA)
    if (estadoJogo === "CONFIRMACAO_FINAL") {
        ctx.fillStyle = "#111827"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffe600"; ctx.font = "bold 45px Arial"; ctx.textAlign = "center";
        ctx.fillText("VOCÊ TEM CERTEZA?", canvas.width / 2, 120);
        
        ctx.fillStyle = "white"; ctx.font = "24px Arial";
        ctx.fillText(`Provas encontradas: ${pistasColetadas} / ${totalPistas}`, canvas.width / 2, 200);
        
        ctx.fillStyle = "#94a3b8"; ctx.font = "20px Arial";
        ctx.fillText("Ao prosseguir, você entrará na sala de interrogatório para dar seu veredito.", canvas.width / 2, 260);
        ctx.fillText("Garanta que analisou as contradições dos suspeitos corretamente.", canvas.width / 2, 300);
        
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 24px Arial";
        ctx.fillText("[ Aperte A ou ESPAÇO para ir ao Confronto Final ]", canvas.width / 2, canvas.height - 150);
        ctx.textAlign = "left"; requestAnimationFrame(gameLoop); return;
    }

    if (estadoJogo === "FIM_TEMPO") {
        ctx.fillStyle = "rgba(10, 0, 0, 0.98)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff4444"; ctx.textAlign = "center"; ctx.font = "bold 70px sans-serif";
        ctx.fillText("⏳ TEMPO ESGOTADO!", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillStyle = "white"; ctx.font = "26px sans-serif";
        ctx.fillText("O trem partiu e o verdadeiro culpado sumiu do mapa com a relíquia!", canvas.width / 2, canvas.height / 2 + 30);
        ctx.textAlign = "left"; requestAnimationFrame(gameLoop); return;
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
    }

    // Desenha Itens e NPCs
    for (let item of itensCenario) {
        if (!item.coletado) {
            ctx.fillStyle = "gold"; ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "black"; ctx.font = "bold 24px Arial"; ctx.fillText("?", item.x + 13, item.y + 28);
        }
    }
    for (let npc of npcs) {
        if (npc.img.complete && npc.img.naturalWidth > 0) { ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h); }
    }
    if (detetiveImg.complete && detetiveImg.naturalWidth > 0) {
        ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.w, detetive.h);
    }

    // --- LANTERNA ---
    ctx.save();
    let lanternaCanvas = document.createElement('canvas');
    lanternaCanvas.width = canvas.width; lanternaCanvas.height = canvas.height;
    let lCtx = lanternaCanvas.getContext('2d');
    
    // 6. TELA FICA AVERMELHADA NOS ÚLTIMOS 30 SEGUNDOS
    if (tempoRestante <= 30) {
        lCtx.fillStyle = "rgba(139, 0, 0, 0.82)";
    } else {
        lCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
    }
    lCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    lCtx.globalCompositeOperation = 'destination-out';
    let centroX = detetive.x + detetive.w / 2;
    let centroY = detetive.y + detetive.h / 2;
    let gradiente = lCtx.createRadialGradient(centroX, centroY, 50, centroX, centroY, 190);
    gradiente.addColorStop(0, 'rgba(0,0,0,1)');
    gradiente.addColorStop(1, 'rgba(0,0,0,0)');
    lCtx.fillStyle = gradiente; lCtx.beginPath(); lCtx.arc(centroX, centroY, 190, 0, Math.PI * 2); lCtx.fill();
    ctx.drawImage(lanternaCanvas, 0, 0);
    ctx.restore();

    // 6. TEXTOS ALERTAS DE CONSEQUÊNCIAS DE TEMPO
    if (tempoRestante <= 120 && tempoRestante > 115) {
        ctx.fillStyle = "#ffaa00"; ctx.font = "bold 22px Arial";
        ctx.fillText("⚠️ O Rival começou a se movimentar em direção à saída!", 400, 100);
    }
    if (tempoRestante <= 60 && tempoRestante > 55) {
        ctx.fillStyle = "#ff4444"; ctx.font = "bold 24px Arial";
        ctx.fillText("🔊 *O trem apitou na estação! Menos de 1 minuto!*", 430, 100);
    }

    // HUD: Painel Superior Unificado
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(20, 20, 190, 45); 
    ctx.fillStyle = "#64ffda"; ctx.font = "bold 16px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " / " + totalPistas, 40, 48);

    // 7. INVENTÁRIO DE PROVAS TEXTUAL NA TELA
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(225, 20, 460, 45);
    ctx.strokeStyle = "#ffe600"; ctx.lineWidth = 1; ctx.strokeRect(225, 20, 460, 45);
    ctx.fillStyle = "white"; ctx.font = "12px sans-serif";
    let textoInv = inventarioProvas.length > 0 ? inventarioProvas.join("  ") : "Mochila Vazia";
    ctx.fillText(textoInv, 240, 46);

    // 2. CADERNO DE ANOTAÇÕES RENDERIZADO LATERALMENTE
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)"; ctx.fillRect(20, 90, 310, 200);
    ctx.strokeStyle = "#64ffda"; ctx.strokeRect(20, 90, 310, 200);
    ctx.fillStyle = "#ffe600"; ctx.font = "bold 15px Arial"; ctx.fillText("📓 CADERNO DE ANOTAÇÕES:", 35, 115);
    ctx.fillStyle = "white"; ctx.font = "12px Arial";
    let posY = 145;
    for (let i = Math.max(0, cadernoAnotacoes.length - 4); i < cadernoAnotacoes.length; i++) {
        let textoCortado = cadernoAnotacoes[i].substring(0, 40) + "...";
        ctx.fillText("- " + textoCortado, 35, posY);
        posY += 30;
    }

    // HUD: Relógio
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(canvas.width - 200, 20, 160, 45);
    let corTempo = tempoRestante <= 30 ? "#ff4444" : "#64ffda";
    ctx.fillStyle = corTempo; ctx.font = "bold 18px Arial";
    ctx.fillText("⏳ Faltam: " + formatarTempo(tempoRestante), canvas.width - 180, 48);

    // Caixas de Diálogo comuns
    if (estadoJogo === "DIALOGO") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.fillStyle = npcFoco.tipo === "sistema" ? "#ffe600" : "#64ffda"; ctx.font = "bold 26px Arial"; ctx.fillText(npcFoco.nome + ":", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";
        if (textoResposta !== "") {
            if (charIndex < textoResposta.length) charIndex += textSpeed;
            wrapText(ctx, textoResposta.substring(0, Math.floor(charIndex)), 190, 635, 1000, 30);
        } else {
            ctx.fillStyle = "#e2e8f0"; ctx.fillText("Perguntar:", 190, 625);
            ctx.fillStyle = "#64ffda"; ctx.fillText(npcFoco.pergunta1, 210, 665); ctx.fillText(npcFoco.pergunta2, 210, 695);
        }
    }

    if (estadoJogo === "RIVAL_DIALOGO") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.fillStyle = "#ff4444"; ctx.font = "bold 26px Arial"; ctx.fillText("Rival:", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";
        let txtOriginal = textosRival[falaRival];
        if (charIndex < txtOriginal.length) charIndex += textSpeed;
        wrapText(ctx, txtOriginal.substring(0, Math.floor(charIndex)), 190, 625, 1000, 30);
    }

    // --- 1. MÚLTIPLOS FINAIS E 9. NOTA FINAL COMPLETA ---
    if (estadoJogo === "FIM") {
        ctx.fillStyle = "rgba(10, 15, 30, 0.98)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center"; 
        
        let nomeAcusado = suspeitosNomes[suspeitoSelecionado];
        let nota = "F";
        let mensagemFinal = "";
        let tipoFinal = "";

        if (pistasColetadas < 3) {
            // Final Neutro
            tipoFinal = "🎭 FINAL NEUTRO: FALTARAM PROVAS";
            nota = "C";
            mensagemFinal = `Você acusou o ${nomeAcusado}, mas sem investigar o suficiente, a vila ficou dividida e o caso terminou arquivado por falta de embasamento técnico.`;
        } else if (nomeAcusado === culpadoVerdadeiro) {
            // Final Verdadeiro ou Secreto dependendo de quem foi sorteado
            if (culpadoVerdadeiro === "Rival") {
                tipoFinal = "🏆 FINAL VERDADEIRO: JUSTIÇA FEITA";
                nota = "A";
                mensagemFinal = "Excelente trabalho! O Rival confessou o roubo do relógio após ser confrontado com o Lenço de seda e as marcas do sapato elegante.";
            } else {
                tipoFinal = "🌟 FINAL SECRETO: REVIRAVOLTA NA VILA";
                nota = "S";
                mensagemFinal = "Impressionante! Você percebeu a mentira do Seu Zé. Ele forjou as provas para culpar o Rival por causa de velhas dívidas.";
            }
        } else {
            // Final Ruim
            tipoFinal = "❌ FINAL RUIM: INOCENTE CONDENADO";
            nota = "D";
            mensagemFinal = `Tragédia! Você apontou o dedo para o ${nomeAcusado}. O verdadeiro culpado (${culpadoVerdadeiro}) fugiu com o relógio de ouro e riu da polícia.`;
        }

        ctx.fillStyle = "#ffe600"; ctx.font = "bold 45px sans-serif"; ctx.fillText(tipoFinal, canvas.width / 2, 140);
        ctx.fillStyle = "white"; ctx.font = "22px sans-serif"; wrapText(ctx, mensagemFinal, canvas.width / 2, 220, 950, 35);
        
        // Quadro de Nota Final (Estatísticas Completas)
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; ctx.fillRect(454, 380, 500, 220);
        ctx.strokeStyle = "#64ffda"; ctx.strokeRect(454, 380, 500, 220);
        
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 26px Arial"; ctx.fillText(`⭐ NOTA DE DETETIVE: ${nota}`, canvas.width / 2, 425);
        ctx.fillStyle = "white"; ctx.font = "18px Arial";
        ctx.fillText(`Tempo restante: ${formatarTempo(tempoRestante)}`, canvas.width / 2, 475);
        ctx.fillText(`Provas coletadas: ${pistasColetadas} / ${totalPistas}`, canvas.width / 2, 515);
        ctx.fillText(`Acusação correta: ${nomeAcusado === culpadoVerdadeiro ? "SIM" : "NÃO"}`, canvas.width / 2, 555);

        ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "14px Arial"; ctx.fillText("Desenvolvido por Anna Jullya Costa De Araujo", canvas.width / 2, canvas.height - 40);
        ctx.textAlign = "left"; 
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() { update(); draw(); }
gameLoop();
