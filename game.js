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
let inteImg = carregarImagem("inte.png"); // IMAGEM DO JULGAMENTO

// --- VARIÁVEIS DE ESTADO E HISTÓRIA ---
let estadoJogo = "INTRO"; 
let npcFoco = null; 
let textoResposta = ""; 
let pistasColetadas = 0;
let totalPistas = 3;

// Variáveis para a Acusação Final
let falaRival = 0;
let transicaoFase = 0;
let suspeitoSelecionado = 0; // 0 a 4 (Rival, Tião, Padre, Zé, Maria)
let suspeitosNomes = ["Rival", "Tião", "Padre", "Seu Zé", "Dona Maria"];

// Textos da Introdução
let textosIntro = [
    "Em um dia aparentemente comum na pequena cidade da roça, um grande crime abalou a tranquilidade dos moradores. No alto do morro, na casa mais luxuosa da região, vivia o respeitado presidente Jairo. Entre seus bens mais valiosos estava um relógio de ouro raro, uma relíquia de família passada de geração em geração durante décadas.",
    "Mas, ao amanhecer, uma notícia chocante se espalhou pela cidade: o relógio havia sido roubado!",
    "O desaparecimento da preciosa herança gerou medo, dúvidas e muitas suspeitas. Entre os moradores, um nome logo começou a ser comentado: Tião. Mas será que ele é realmente o culpado ou está sendo acusado injustamente?",
    "Diante desse mistério, precisamos da ajuda do melhor detetive da região. E esse detetive é você!",
    "Sua missão será investigar as pistas, interrogar os suspeitos, descobrir o verdadeiro ladrão e, acima de tudo, provar se Tião é culpado ou inocente.",
    "Boa sorte, detetive. Toda a cidade confia em você para solucionar este caso!"
];
let introFase = 0;

// Textos do Rival
let textosRival = [
    "Detetive, tenha dó de mim! Sou um homem muito respeitado e prestigiado nesta cidade. Passei minha vida inteira trabalhando honestamente e conquistando a confiança de todos os moradores.",
    "Mas, nos últimos dias, o presidente Jairo se voltou contra mim. Não sei o motivo, mas ele passou a me tratar com desconfiança. Agora, depois do roubo do relógio de ouro, muitos estão apontando o dedo para mim.",
    "Eu juro pela minha honra: jamais faria uma coisa dessas com ele. Posso ter minhas diferenças com o presidente Jairo, mas nunca roubarei ninguém, muito menos uma relíquia tão importante para sua família.",
    "Peço apenas que investigue os fatos antes de me julgar. Encontre o verdadeiro culpado e prove minha inocência."
];

// Textos da Transição Final
let textosTransicao = [
    "E agora, detetive? Todos os envolvidos parecem esconder algum segredo. A cada depoimento, novas contradições surgem, e cada pista encontrada levanta ainda mais dúvidas.",
    "Algumas provas apontam para um suspeito, enquanto outras parecem inocentá-lo. Em quem confiar? Quem está dizendo a verdade e quem está tentando enganá-lo?",
    "Por trás dos sorrisos amigáveis e das histórias bem ensaiadas, pode estar escondido o verdadeiro responsável pelo roubo do relógio de ouro. Mas cuidado: nem tudo é o que parece.",
    "Nesta cidade, cada morador tem algo a esconder, e alguns segredos podem ser mais perigosos do que o próprio crime.",
    "Sua missão não será apenas encontrar o ladrão, mas também separar fatos de mentiras, descobrir quais provas são verdadeiras e revelar os segredos que todos tentam manter enterrados.",
    "Analise cada detalhe, questione cada suspeito e siga as pistas com atenção. Somente assim você poderá responder à pergunta que atormenta toda a cidade:\n\nQuem roubou o relógio de ouro do presidente Jairo?"
];

let detetive = { x: 660, y: 350, w: 85, h: 85, speed: 6 };

let npcs = [
    { nome: "Seu Zé", img: zeImg, x: 250, y: 280, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. Viu algo estranho na noite do roubo?", resposta1: "Vi o Rival correndo pra mata com um saco de moedas!", daPista1: true, pergunta2: "2. Como é o Tião?", resposta2: "Tião é trabalhador, nunca roubou.", daPista2: false },
    { nome: "Dona Maria", img: mariaImg, x: 1150, y: 550, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que encontrou na casa do Tião?", resposta1: "Achei um lenço chique. Tião não usa seda... mas o Rival sim.", daPista1: true, pergunta2: "2. Tião tem inimigos?", resposta2: "Apenas o Rival. Brigaram por terras.", daPista2: false },
    { nome: "Padre", img: padreImg, x: 1050, y: 250, w: 85, h: 85, tipo: "testemunha", pistaColetada: false, pergunta1: "1. O que o Tião fazia na hora do crime?", resposta1: "Ele estava comigo na igreja, ajudando a limpar.", daPista1: false, pergunta2: "2. O Rival tem se confessado?", resposta2: "Sim, confessou um plano contra o Tião.", daPista2: true },
    { nome: "Tião", img: tiaoImg, x: 660, y: 600, w: 85, h: 85, tipo: "aliado", pistaColetada: false, pergunta1: "1. Fique calmo, vou te tirar dessa.", resposta1: "Obrigado, detetive! Confio na sua investigação.", daPista1: false, pergunta2: "2. Quem te incriminou?", resposta2: "Só pode ser o engravatado do Rival!", daPista2: false },
    { nome: "Rival", img: rivalImg, x: 150, y: 550, w: 85, h: 85, tipo: "rival" }
];

let keys = {};

function acionarAcao(tecla) {
    // Tela 1: INTRODUÇÃO
    if (estadoJogo === "INTRO") {
        if (tecla === " ") {
            introFase++;
            if (introFase >= textosIntro.length) estadoJogo = "EXPLORANDO";
        }
        return; 
    }

    // Tela 2: DIÁLOGO DRAMÁTICO DO RIVAL
    if (estadoJogo === "RIVAL_DIALOGO") {
        if (tecla === " ") {
            falaRival++;
            if (falaRival >= textosRival.length) {
                estadoJogo = "TRANSICAO_FINAL";
            }
        }
        return;
    }

    // Tela 3: TRANSIÇÃO E REFLEXÃO
    if (estadoJogo === "TRANSICAO_FINAL") {
        if (tecla === " ") {
            transicaoFase++;
            if (transicaoFase >= textosTransicao.length) {
                estadoJogo = "ACUSACAO";
            }
        }
        return;
    }

    // Tela 4: SELEÇÃO DO ACUSADO (Julgamento)
    if (estadoJogo === "ACUSACAO") {
        if (tecla === "ArrowRight") {
            suspeitoSelecionado = (suspeitoSelecionado + 1) % 5;
        }
        if (tecla === "ArrowLeft") {
            suspeitoSelecionado = (suspeitoSelecionado - 1 + 5) % 5; // Evita número negativo
        }
        if (tecla === " ") {
            estadoJogo = "FIM"; 
        }
        return;
    }

    // Lógica Normal de Exploração
    if (tecla === " " && estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            npcFoco = perto;
            textoResposta = "";
            
            if (npcFoco.tipo === "rival") {
                if (pistasColetadas >= totalPistas) {
                    // Começa o drama do Rival
                    estadoJogo = "RIVAL_DIALOGO";
                    falaRival = 0;
                } else {
                    estadoJogo = "DIALOGO";
                    textoResposta = "RIVAL: Saia daqui! Volte quando tiver provas de verdade!";
                }
            } else {
                estadoJogo = "DIALOGO";
            }
        }
    } 
    else if (tecla === " " && estadoJogo === "DIALOGO" && textoResposta !== "") {
        estadoJogo = "EXPLORANDO";
        npcFoco = null;
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

// --- CRIANDO OS CONTROLES MOBILE ---
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

    btn.addEventListener("touchstart", pressionar);
    btn.addEventListener("touchend", soltar);
    btn.addEventListener("mousedown", pressionar);
    btn.addEventListener("mouseup", soltar);
    btn.addEventListener("mouseleave", soltar);
    document.body.appendChild(btn);
}

// Botões
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

// Função para quebrar linhas automaticamente no Canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
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

    // --- TELA DE INTRODUÇÃO ---
    if (estadoJogo === "INTRO") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "32px Arial";
        wrapText(ctx, textosIntro[introFase], canvas.width / 2, canvas.height / 2 - 40, 1000, 45);
        ctx.fillStyle = "#64ffda"; ctx.font = "20px Arial";
        ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", canvas.width / 2, canvas.height - 80);
        ctx.textAlign = "left"; 
        requestAnimationFrame(gameLoop);
        return; 
    }
    
    // --- TELA DE TRANSIÇÃO (Reflexão do Detetive) ---
    if (estadoJogo === "TRANSICAO_FINAL") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "32px Arial";
        wrapText(ctx, textosTransicao[transicaoFase], canvas.width / 2, canvas.height / 2 - 40, 1000, 45);
        ctx.fillStyle = "#64ffda"; ctx.font = "20px Arial";
        ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", canvas.width / 2, canvas.height - 80);
        ctx.textAlign = "left"; 
        requestAnimationFrame(gameLoop);
        return;
    }

    // --- TELA DE ACUSAÇÃO (A Escolha Final) ---
    if (estadoJogo === "ACUSACAO") {
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (inteImg.complete && inteImg.naturalWidth > 0) {
            let imgW = 800; // Largura da imagem na tela
            let imgH = 450; // Altura da imagem na tela
            let startX = (canvas.width - imgW) / 2;
            let startY = (canvas.height - imgH) / 2 - 40;
            
            ctx.drawImage(inteImg, startX, startY, imgW, imgH);
            
            // Desenha a caixa de seleção vermelha sobre o suspeito
            let charW = imgW / 5; // Divide a imagem em 5 partes
            let selX = startX + (suspeitoSelecionado * charW);
            
            ctx.strokeStyle = "red";
            ctx.lineWidth = 6;
            ctx.strokeRect(selX, startY, charW, imgH);
            
            // Textos da Tela
            ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "bold 40px Arial";
            ctx.fillText("QUEM É O CULPADO?", canvas.width / 2, 100);
            
            ctx.fillStyle = "#ffe600"; ctx.font = "bold 32px Arial";
            ctx.fillText("Acusar: " + suspeitosNomes[suspeitoSelecionado], canvas.width / 2, startY + imgH + 60);
            
            ctx.fillStyle = "#64ffda"; ctx.font = "22px Arial";
            ctx.fillText("Use SETAS (Esquerda/Direita) para escolher e A/ESPAÇO para confirmar", canvas.width / 2, startY + imgH + 110);
        } else {
            ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "20px Arial";
            ctx.fillText("Carregando suspeitos... (Verifique a imagem inte.png)", canvas.width / 2, canvas.height / 2);
        }
        
        ctx.textAlign = "left"; 
        requestAnimationFrame(gameLoop);
        return;
    }

    // --- O JOGO PRINCIPAL E DIÁLOGOS ---
    if (mapaImg.complete && mapaImg.naturalWidth > 0) {
        ctx.drawImage(mapaImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#333"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.font = "20px Arial"; ctx.fillText("Carregando mapa...", 500, 380);
    }

    for (let npc of npcs) {
        if (npc.img.complete && npc.img.naturalWidth > 0) {
            ctx.drawImage(npc.img, npc.x, npc.y, npc.w, npc.h);
        } else {
            ctx.fillStyle = "purple"; ctx.fillRect(npc.x, npc.y, npc.w, npc.h);
        }
        
        if (npc.tipo === "testemunha" && !npc.pistaColetada) {
            ctx.fillStyle = "yellow"; ctx.font = "bold 35px Arial"; ctx.fillText("!", npc.x + 35, npc.y - 5);
        }
    }

    if (detetiveImg.complete && detetiveImg.naturalWidth > 0) {
        ctx.drawImage(detetiveImg, detetive.x, detetive.y, detetive.w, detetive.h);
    } else {
        ctx.fillStyle = "blue"; ctx.fillRect(detetive.x, detetive.y, detetive.w, detetive.h);
    }

    if (estadoJogo === "EXPLORANDO") {
        let perto = npcs.find(n => colidindo(detetive, n));
        if (perto) {
            ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(detetive.x - 20, detetive.y - 45, 130, 30);
            ctx.fillStyle = "white"; ctx.font = "bold 13px sans-serif"; ctx.fillText("Botão A / ESPAÇO", detetive.x - 12, detetive.y - 25);
        }
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(20, 20, 200, 45); 
    ctx.strokeStyle = "#64ffda"; ctx.lineWidth = 2; ctx.strokeRect(20, 20, 200, 45);
    ctx.fillStyle = "#64ffda"; ctx.font = "bold 18px sans-serif";
    ctx.fillText("🔎 Provas: " + pistasColetadas + " / " + totalPistas, 45, 48);

    // Diálogo Normal
    if (estadoJogo === "DIALOGO") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.strokeStyle = "#64ffda"; ctx.lineWidth = 4; ctx.strokeRect(154, 540, 1100, 180);
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 26px Arial"; ctx.fillText(npcFoco.nome + ":", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";

        if (textoResposta !== "") {
            ctx.fillText(textoResposta, 190, 635);
            ctx.fillStyle = "#94a3b8"; ctx.font = "16px Arial"; ctx.fillText("[ Aperte A (ou ESPAÇO) para fechar ]", 190, 690);
        } 
        else if (npcFoco.tipo !== "rival") {
            ctx.fillStyle = "#e2e8f0"; ctx.fillText("Escolha o que perguntar (botões 1 ou 2):", 190, 625);
            ctx.fillStyle = "#64ffda"; ctx.fillText(npcFoco.pergunta1, 210, 665); ctx.fillText(npcFoco.pergunta2, 210, 695);
        }
    }

    // Diálogo Dramático do Rival
    if (estadoJogo === "RIVAL_DIALOGO") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(154, 540, 1100, 180);
        ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 4; ctx.strokeRect(154, 540, 1100, 180);
        ctx.fillStyle = "#ff4444"; ctx.font = "bold 26px Arial"; ctx.fillText("Rival:", 190, 585);
        ctx.fillStyle = "white"; ctx.font = "21px Arial";
        
        wrapText(ctx, textosRival[falaRival], 190, 625, 1000, 30);
        
        ctx.fillStyle = "#94a3b8"; ctx.font = "16px Arial"; ctx.fillText("[ Aperte A (ou ESPAÇO) para continuar ]", 190, 700);
    }

    // --- GAME OVER / VITÓRIA ---
    if (estadoJogo === "FIM") {
        ctx.fillStyle = "rgba(0, 15, 5, 0.95)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center"; 
        
        // Se escolheu o índice 0 (O primeiro cara de terno na imagem, que é o Rival)
        if (suspeitoSelecionado === 0) { 
            ctx.fillStyle = "#ffe600"; ctx.font = "bold 70px sans-serif";
            ctx.fillText("🏆 VOCÊ VENCEU!", canvas.width / 2, canvas.height / 2 - 30);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif";
            ctx.fillText("Parabéns, detetive! Apesar da história comovente,", canvas.width / 2, canvas.height / 2 + 30);
            ctx.fillText("as pistas provaram que o Rival era o verdadeiro culpado!", canvas.width / 2, canvas.height / 2 + 70);
        } else {
            ctx.fillStyle = "#ff4444"; ctx.font = "bold 70px sans-serif";
            ctx.fillText("❌ ACUSAÇÃO INCORRETA", canvas.width / 2, canvas.height / 2 - 30);
            ctx.fillStyle = "white"; ctx.font = "26px sans-serif";
            ctx.fillText("Você acusou a pessoa errada! O verdadeiro culpado escapou", canvas.width / 2, canvas.height / 2 + 30);
            ctx.fillText("e um inocente pagou pelo crime. O mistério continua...", canvas.width / 2, canvas.height / 2 + 70);
        }
        
        ctx.fillStyle = "#64ffda"; ctx.font = "bold 20px sans-serif";
        ctx.fillText(">> Atualize a página para jogar novamente <<", canvas.width / 2, canvas.height / 2 + 150);
        ctx.textAlign = "left"; 
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    draw();
}

gameLoop();
