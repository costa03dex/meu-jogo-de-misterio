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

// O canvas agora ocupa a tela livremente, sem títulos acima dele
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

let timerJogo = setInterval(() => {
    if (estadoJogo === "EXPLORANDO" || estadoJogo === "DIALOGO" || estadoJogo === "RIVAL_DIALOGO") {
        if (tempoRestante > 0) {
            tempoRestante--;
        } else {
            estadoJogo = "FIM_TEMPO";
        }
    }
}, 1000);

// --- PERSONAGENS ---
let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. Viu algo estranho na noite do roubo?", resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true, pergunta2: "2. Como é o Tião?", resposta2: "Tião é trabalhador, nunca roubou.", daPista2: false },
    { nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que encontrou na casa do Tião?", resposta1: "Achei uma luva de luxo perto da janela do Tião. Ele não tem dinheiro pra isso.", daPista1: true, pergunta2: "2. Tião tem inimigos?", resposta2: "Apenas o Rival. Brigaram por terras.", daPista2: false },
    { nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que o Tião fazia na hora do crime?", resposta1: "Ele estava comigo na igreja, ajudando a limpar.", daPista1: false, pergunta2: "2. O Rival tem se confessado?", resposta2: "Sim, confessou um plano terrível contra o Tião na semana passada.", daPista2: true },
    { nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, pergunta1: "1. Fique calmo, vou te tirar dessa.", resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false, pergunta2: "2. Quem te incriminou?", resposta2: "Só pode ser o engravatado do Rival!", daPista2: false },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival" }
];

let itensCenario = [
    { nome: "Lenço de Seda", icone: "🧣", x: 850, y: 150, w: 40, h: 40, coletado: false }
];

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
        let hitboxInteracao = { x: detetive.x - 25, y: detetive.y - 25, w: detetive.w + 50, h: detetive.h + 50 };
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
                    let itensNaMochila = itensCenario.filter(i => i.coletado).map(i => i.nome).join(", ") || "Nenhum objeto";
                    let depoimentosNaMochila = npcs.filter(n => n.pistaColetada).map(n => n.nome).join(", ") || "Nenhum depoimento";
                    textoResposta = `RIVAL: Saia daqui! Você ainda não tem todas as provas! [MOCHILA ATUAL: Itens: ${itensNaMochila} | Depoimentos de: ${depoimentosNaMochila}]`;
                }
            } else {
                estadoJogo = "DIALOGO";
            }
        } else if (pertoItem) {
            somPista.play();
            pertoItem.coletado = true;
            pistasColetadas++;
            estadoJogo = "DIALOGO";
            npcFoco = { nome: "MOCHILA DO DETETIVE", tipo: "sistema" };
            textoResposta = `Você guardou na mochila: ${pertoItem.nome}! Havia marcas de sapato elegante ao lado...`;
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
        let andando = keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"];
        
        if (andando) {
            if (somPassos.paused) somPassos.play().catch(() => {});
        } else {
            somPassos.pause();
        }

        // Movimento livre de colisões com o cenário ou npcs
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
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.font = "italic 18px Arial";
        ctx.fillText("Um jogo desenvolvido por: Anna Jullya Costa De Araujo", canvas.width / 2, 45);

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
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; ctx.font = "16px Arial";
        ctx.fillText("Criado por Anna Jullya Costa De Araujo", canvas.width / 2, canvas.height - 40);

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

    if (estadoJogo === "EXPLORANDO") {
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

    // --- INVENTÁRIO VISUAL ---
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(235, 20, 320, 45);
    ctx.strokeStyle = "#ffe600"; ctx.lineWidth = 2; ctx.strokeRect(235, 20, 320, 45);
    ctx.fillStyle = "white"; ctx.font = "bold 15px sans-serif"; ctx.fillText("🎒 Bolsa do Detetive:", 250, 48);
    
    let posXItem = 405;
    for (let item of itensCenario) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; ctx.fillRect(posXItem, 27, 30, 30);
        ctx.strokeRect(posXItem, 27, 30, 30);
        if (item.coletado) { ctx.font = "20px Arial"; ctx.fillText(item.icone, posXItem + 3, 50); }
        posXItem += 38;
    }
    let npcsComPista = npcs.filter(n => n.tipo === "testemunha");
    for (let npc of npcsComPista) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; ctx.fillRect(posXItem, 27, 30, 30);
        ctx.strokeStyle = npc.pistaColetada ? "#64ffda" : "#ffe600";
        ctx.strokeRect(posXItem, 27, 30, 30);
        if (npc.pistaColetada) { ctx.font = "20px Arial"; ctx.fillText("📝", posXItem + 3, 50); }
        posXItem += 38;
    }

    // HUD: Relógio
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(canvas.width - 220, 20, 180, 45);
    let corTempo = tempoRestante <= 30 ? "#ff4444" : "#64ffda";
    ctx.strokeStyle = corTempo; ctx.lineWidth = 2; ctx.strokeRect(canvas.width - 220, 20, 180, 45);
    ctx.fillStyle = corTempo; ctx.font = "bold 20px Arial";
    ctx.fillText("⏳ Tempo: " + formatarTempo(tempoRestante), canvas.width - 200, 48);

    // Diálogos
    if (estadoJogo === "DIALOGO") {
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
        } else if (npcFoco.tipo !== "rival" && npcFoco.tipo !== "sistema") {
            ctx.fillStyle = "#e2e8f0"; ctx.fillText("Escolha o que perguntar (botões 1 ou 2):", 190, 625);
            ctx.fillStyle = "#64ffda"; ctx.fillText(npcFoco.pergunta1, 210, 665); ctx.fillText(npcFoco.pergunta2, 210, 695);
        }
    }

    // Diálogo do Rival
    if (estadoJogo === "RIVAL_DIALOGO") {
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

    if (estadoJogo === "FIM") {
        ctx.fillStyle = "rgba(0, 15, 5, 0.95)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center"; 
        if (suspeitoSelecionado === 0) { 
            ctx.fillStyle = "#ffe600"; ctx.font = "bold 70px sans-serif"; ctx.fillText("🏆 VOCÊ VENCEU!", canvas.width / 2, canvas.height / 2 - 30);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Parabéns, detetive! Apesar da história comovente,", canvas.width / 2, canvas.height / 2 + 30);
            ctx.fillText("as pistas provaram que o Rival era o verdadeiro culpado!", canvas.width / 2, canvas.height / 2 + 70);
        } else {
            ctx.fillStyle = "#ff4444"; ctx.font = "bold 70px sans-serif"; ctx.fillText("❌ ACUSAÇÃO INCORRETA", canvas.width / 2, canvas.height / 2 - 30);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif"; ctx.fillText("Você acusou a pessoa errada! O verdadeiro culpado escapou", canvas.width / 2, canvas.height / 2 + 30);
            ctx.fillText("e um inocente pagou pelo crime. O mistério continua...", canvas.width / 2, canvas.height / 2 + 70);
        }
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; ctx.font = "16px Arial";
        ctx.fillText("Jogo criado por Anna Jullya Costa De Araujo", canvas.width / 2, canvas.height - 40);

        ctx.fillStyle = "#64ffda"; ctx.font = "bold 20px sans-serif"; ctx.fillText(">> Atualize a página para jogar novamente <<", canvas.width / 2, canvas.height / 2 + 150);
        ctx.textAlign = "left"; 
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() { update(); draw(); }
gameLoop();
