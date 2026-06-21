<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mistério na Vila 2.0</title>

<style>
body{
    margin:0;
    overflow:hidden;
    background:#111;
}

#caderno{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:700px;
    height:500px;
    background:#f5e8c7;
    border:8px solid #5c4033;
    display:none;
    padding:20px;
    box-sizing:border-box;
    font-family:Arial;
    overflow:auto;
    z-index:999;
}

#caderno h2{
    margin-top:0;
}

canvas{
    display:block;
}
</style>
</head>

<body>

<div id="caderno">
    <h2>📖 Caderno do Detetive</h2>

    <div id="pistasLista"></div>

    <hr>

    <div id="suspeitosLista"></div>

    <hr>

    <div id="tempoLista"></div>
</div>

<canvas id="game"></canvas>

<script>

// =============================
// CANVAS
// =============================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1408;
canvas.height = 768;

// =============================
// IMAGENS
// =============================

function img(src){
    let i = new Image();
    i.src = src;
    return i;
}

const sprites = {

    detetive: img("detetive.png"),
    ze: img("ze.png"),
    maria: img("maria.png"),
    padre: img("padre.png"),
    tiao: img("tiao.png"),
    rival: img("rival.png"),

    vila: img("mapa.png"),
    igreja: img("mapa_igreja.png"),
    fazenda: img("mapa_fazenda.png"),
    mata: img("mapa_mata.png"),
    estacao: img("mapa_estacao.png")
};

// =============================
// MAPAS
// =============================

let mapaAtual = "vila";

const mapas = {

    vila:{
        imagem:"vila"
    },

    igreja:{
        imagem:"igreja"
    },

    fazenda:{
        imagem:"fazenda"
    },

    mata:{
        imagem:"mata"
    },

    estacao:{
        imagem:"estacao"
    }
};

// =============================
// JOGADOR
// =============================

const jogador = {

    x:650,
    y:350,

    w:80,
    h:80,

    speed:5
};

// =============================
// TECLAS
// =============================

const keys = {};

window.addEventListener("keydown",(e)=>{

    keys[e.key]=true;

    if(e.key==="Tab"){
        e.preventDefault();
        alternarCaderno();
    }
});

window.addEventListener("keyup",(e)=>{
    keys[e.key]=false;
});

// =============================
// SUSPEITOS
// =============================

const suspeita = {

    "Rival":20,
    "Tião":20,
    "Padre":20,
    "Seu Zé":20,
    "Dona Maria":20
};

// =============================
// CULPADO ALEATÓRIO
// =============================

const suspeitos = [

    "Rival",
    "Tião",
    "Padre",
    "Seu Zé",
    "Dona Maria"
];

let culpadoReal =
suspeitos[
Math.floor(
Math.random()*suspeitos.length
)];

console.log("CULPADO:",culpadoReal);

// =============================
// PISTAS
// =============================

const pistasPossiveis = [

    "Luva de Luxo",
    "Relógio Quebrado",
    "Lenço Manchado",
    "Bilhete Rasgado",
    "Pegadas",
    "Moedas de Ouro",
    "Chave Dourada",
    "Carta Misteriosa"
];

function embaralhar(lista){

    let copia = [...lista];

    for(let i=copia.length-1;i>0;i--){

        const j =
        Math.floor(
        Math.random()*(i+1)
        );

        [copia[i],copia[j]]
        =
        [copia[j],copia[i]];
    }

    return copia;
}

const pistasEscolhidas =
embaralhar(
pistasPossiveis
).slice(0,4);

// =============================
// INVENTÁRIO
// =============================

const inventario = [];

// =============================
// ITENS DO MAPA
// =============================

const itens = [];

for(let i=0;i<4;i++){

    itens.push({

        nome:pistasEscolhidas[i],

        x:100 + Math.random()*1100,
        y:100 + Math.random()*500,

        w:40,
        h:40,

        coletado:false
    });
}

// =============================
// NPCS
// =============================

const npcs = [

{
nome:"Seu Zé",
img:"ze",
x:250,
y:250,
w:80,
h:80
},

{
nome:"Dona Maria",
img:"maria",
x:1150,
y:550,
w:80,
h:80
},

{
nome:"Padre",
img:"padre",
x:1000,
y:200,
w:80,
h:80
},

{
nome:"Tião",
img:"tiao",
x:650,
y:600,
w:80,
h:80
},

{
nome:"Rival",
img:"rival",
x:150,
y:550,
w:80,
h:80
}
];

// =============================
// TEMPO
// =============================

let tempoMaximo = 300;
let tempoRestante = tempoMaximo;

setInterval(()=>{

    tempoRestante--;

    if(tempoRestante < 0){

        tempoRestante = 0;
    }

},1000);

// =============================
// CADERNO
// =============================

function alternarCaderno(){

    const c =
    document.getElementById(
    "caderno"
    );

    if(c.style.display==="block"){

        c.style.display="none";
    }
    else{

        atualizarCaderno();

        c.style.display="block";
    }
}

function atualizarCaderno(){

    document.getElementById(
    "pistasLista"
    ).innerHTML =

    "<b>Pistas Encontradas:</b><br>" +

    (
    inventario.length
    ?
    inventario.join("<br>")
    :
    "Nenhuma"
    );

    let html =
    "<b>Suspeitos:</b><br>";

    for(let nome in suspeita){

        html +=
        nome +
        ": " +
        suspeita[nome] +
        "%<br>";
    }

    document.getElementById(
    "suspeitosLista"
    ).innerHTML = html;

    document.getElementById(
    "tempoLista"
    ).innerHTML =

    "<b>Tempo:</b> " +
    formatarTempo(
    tempoRestante
    );
}

// =============================
// COLISÃO
// =============================

function colisao(a,b){

    return(

    a.x < b.x+b.w &&
    a.x+a.w > b.x &&

    a.y < b.y+b.h &&
    a.y+a.h > b.y

    );
}

// =============================
// COLETAR PISTA
// =============================

function verificarItens(){

    for(let item of itens){

        if(
        !item.coletado &&
        colisao(
        jogador,
        item
        )
        ){

            item.coletado=true;

            inventario.push(
            item.nome
            );

            suspeita[culpadoReal]
            += 15;
        }
    }
}

// =============================
// TEMPO FORMATADO
// =============================

function formatarTempo(seg){

    let m =
    Math.floor(seg/60);

    let s =
    seg%60;

    return String(m)
    .padStart(2,"0")
    +
    ":"
    +
    String(s)
    .padStart(2,"0");
}

// =============================
// MOVIMENTO
// =============================

function update(){

    if(keys["ArrowUp"])
    jogador.y -= jogador.speed;

    if(keys["ArrowDown"])
    jogador.y += jogador.speed;

    if(keys["ArrowLeft"])
    jogador.x -= jogador.speed;

    if(keys["ArrowRight"])
    jogador.x += jogador.speed;

    verificarItens();
}

// =============================
// DESENHO
// =============================

function draw(){

    ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
    );

    const mapa =
    sprites[
    mapas[mapaAtual]
    .imagem
    ];

    if(
    mapa.complete &&
    mapa.naturalWidth
    ){

        ctx.drawImage(
        mapa,
        0,
        0,
        canvas.width,
        canvas.height
        );
    }

    for(let item of itens){

        if(!item.coletado){

            ctx.fillStyle="gold";

            ctx.beginPath();

            ctx.arc(
            item.x+20,
            item.y+20,
            20,
            0,
            Math.PI*2
            );

            ctx.fill();

            ctx.fillStyle="#000";
            ctx.fillText(
            "?",
            item.x+15,
            item.y+25
            );
        }
    }

    for(let npc of npcs){

        const img =
        sprites[npc.img];

        if(
        img.complete &&
        img.naturalWidth
        ){

            ctx.drawImage(
            img,
            npc.x,
            npc.y,
            npc.w,
            npc.h
            );
        }
    }

    ctx.drawImage(
    sprites.detetive,
    jogador.x,
    jogador.y,
    jogador.w,
    jogador.h
    );

    ctx.fillStyle=
    "rgba(0,0,0,.8)";

    ctx.fillRect(
    20,
    20,
    250,
    45
    );

    ctx.fillStyle=
    "#64ffda";

    ctx.font=
    "20px Arial";

    ctx.fillText(

    "🔎 " +
    inventario.length +
    "/4 pistas",

    40,
    50

    );

    ctx.fillRect(
    1100,
    20,
    250,
    45
    );

    ctx.fillStyle=
    "#fff";

    ctx.fillText(

    "⏳ " +
    formatarTempo(
    tempoRestante
    ),

    1130,
    50

    );
}

// =============================
// LOOP
// =============================

function loop(){

    update();

    draw();

    requestAnimationFrame(
    loop
    );
}

loop();

</script>
</body>
</html>
// ===================================
// DIÁLOGOS AVANÇADOS
// ===================================

let estado = "EXPLORANDO";
let npcAtual = null;
let mensagem = "";

const dialogos = {

    "Seu Zé":[
        "Vi alguém perto da casa do presidente.",
        "Ouvi uma discussão na noite do roubo."
    ],

    "Dona Maria":[
        "Achei pegadas perto da cerca.",
        "O Rival parecia nervoso."
    ],

    "Padre":[
        "Rezei a noite toda.",
        "Nem tudo é o que parece."
    ],

    "Tião":[
        "Sou inocente!",
        "Alguém quer me incriminar."
    ],

    "Rival":[
        "Não tenho nada a esconder.",
        "Você está perdendo tempo."
    ]
};

// ===================================
// NPCS MENTIROSOS
// ===================================

const mentirosos = {};

for(let npc of npcs){

    mentirosos[npc.nome] =
    Math.random() < 0.40;
}

function falarComNPC(nome){

    npcAtual = nome;

    let texto =
    dialogos[nome][
    Math.floor(
    Math.random()*
    dialogos[nome].length
    )
    ];

    if(mentirosos[nome]){

        texto =
        "Hmm... não me lembro de nada.";
    }

    mensagem = texto;

    estado = "DIALOGO";
}

// ===================================
// INTERAÇÃO COM NPC
// ===================================

window.addEventListener("keydown",(e)=>{

    if(e.key===" "){

        if(estado==="EXPLORANDO"){

            for(let npc of npcs){

                if(colisao(
                    jogador,
                    npc
                )){

                    falarComNPC(
                    npc.nome
                    );

                    if(
                    npc.nome===culpadoReal
                    ){

                        suspeita[
                        culpadoReal
                        ] += 10;
                    }

                    break;
                }
            }
        }
        else if(
        estado==="DIALOGO"
        ){

            estado=
            "EXPLORANDO";
        }
    }
});

// ===================================
// SISTEMA DE ACUSAÇÃO
// ===================================

let acusacaoAtiva = false;
let suspeitoSelecionado = 0;

window.addEventListener("keydown",(e)=>{

    if(e.key==="f"){

        acusacaoAtiva=true;
    }

    if(acusacaoAtiva){

        if(e.key==="ArrowRight"){

            suspeitoSelecionado++;

            if(
            suspeitoSelecionado >=
            suspeitos.length
            ){

                suspeitoSelecionado=0;
            }
        }

        if(e.key==="ArrowLeft"){

            suspeitoSelecionado--;

            if(
            suspeitoSelecionado < 0
            ){

                suspeitoSelecionado=
                suspeitos.length-1;
            }
        }

        if(e.key==="Enter"){

            finalizarCaso();
        }
    }
});

// ===================================
// FINALIZAR CASO
// ===================================

let fimJogo = false;
let resultadoFinal = "";
let notaFinal = "";

function finalizarCaso(){

    fimJogo = true;

    let acusado =
    suspeitos[
    suspeitoSelecionado
    ];

    if(
    acusado === culpadoReal
    ){

        resultadoFinal =
        "VOCÊ DESVENDOU O CASO";

        calcularNota(true);
    }
    else{

        resultadoFinal =
        "VOCÊ ACUSOU A PESSOA ERRADA";

        calcularNota(false);
    }
}

// ===================================
// RANKING
// ===================================

function calcularNota(acertou){

    if(
    acertou &&
    inventario.length===4 &&
    tempoRestante>180
    ){

        notaFinal="S";
    }

    else if(acertou){

        notaFinal="A";
    }

    else{

        notaFinal="C";
    }
}

// ===================================
// EVENTO DE FUGA
// ===================================

let fugaAtivada = false;

function verificarTempo(){

    if(
    tempoRestante <= 60 &&
    !fugaAtivada
    ){

        fugaAtivada=true;

        mensagem =
        "⚠ O culpado está tentando fugir!";
    }

    if(
    tempoRestante<=0 &&
    !fimJogo
    ){

        fimJogo=true;

        resultadoFinal =
        "O TREM PARTIU E O CULPADO ESCAPOU";

        notaFinal="D";
    }
}

// ===================================
// HUD DE DIÁLOGO
// ===================================

function desenharDialogo(){

    if(
    estado!=="DIALOGO"
    ) return;

    ctx.fillStyle=
    "rgba(0,0,0,.9)";

    ctx.fillRect(
    150,
    520,
    1100,
    180
    );

    ctx.strokeStyle=
    "#64ffda";

    ctx.lineWidth=4;

    ctx.strokeRect(
    150,
    520,
    1100,
    180
    );

    ctx.fillStyle=
    "#fff";

    ctx.font=
    "24px Arial";

    ctx.fillText(
    npcAtual+":",
    180,
    570
    );

    ctx.fillText(
    mensagem,
    180,
    620
    );
}

// ===================================
// MENU DE ACUSAÇÃO
// ===================================

function desenharAcusacao(){

    if(
    !acusacaoAtiva ||
    fimJogo
    ) return;

    ctx.fillStyle=
    "rgba(0,0,0,.95)";

    ctx.fillRect(
    200,
    100,
    1000,
    500
    );

    ctx.fillStyle=
    "#fff";

    ctx.font=
    "40px Arial";

    ctx.fillText(
    "QUEM É O CULPADO?",
    350,
    170
    );

    for(
    let i=0;
    i<suspeitos.length;
    i++
    ){

        if(
        i===suspeitoSelecionado
        ){

            ctx.fillStyle=
            "#ffe600";
        }
        else{

            ctx.fillStyle=
            "#ffffff";
        }

        ctx.fillText(
        suspeitos[i],
        450,
        260+(i*60)
        );
    }
}

// ===================================
// FINAL
// ===================================

function desenharFinal(){

    if(!fimJogo) return;

    ctx.fillStyle=
    "rgba(0,0,0,.95)";

    ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
    );

    ctx.fillStyle=
    "#64ffda";

    ctx.font=
    "60px Arial";

    ctx.fillText(
    resultadoFinal,
    150,
    250
    );

    ctx.fillStyle=
    "#fff";

    ctx.font=
    "35px Arial";

    ctx.fillText(
    "Nota: "+notaFinal,
    550,
    350
    );

    ctx.fillText(
    "Culpado: "+culpadoReal,
    450,
    430
    );

    ctx.fillText(
    "Pistas: "+
    inventario.length+
    "/4",
    500,
    510
    );
}

// ===================================
// MOBILE
// ===================================

function criarBotao(txt,x,y){

    let b =
    document.createElement("button");

    b.innerHTML=txt;

    b.style.position=
    "absolute";

    b.style.left=x+"px";
    b.style.top=y+"px";

    b.style.width="70px";
    b.style.height="70px";

    b.style.zIndex=999;

    document.body.appendChild(b);

    return b;
}

// ===================================
// SOM
// ===================================

const somPista =
new Audio("pista.wav");

const somDialogo =
new Audio("dialogo.wav");

const somVitoria =
new Audio("vitoria.wav");

// ===================================
// MELHORAR LOOP
// ===================================

const loopOriginal = loop;

function loop(){

    verificarTempo();

    update();

    draw();

    desenharDialogo();

    desenharAcusacao();

    desenharFinal();

    requestAnimationFrame(
    loop
    );
}

loop();
