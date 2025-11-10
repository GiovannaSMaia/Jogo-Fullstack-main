// -------------------------------- PEGANDO TODOS OS ELEMENTOS HTML -------------------------------
const jogar = document.getElementById("botao_jogar"); // variavel do botao de iniciar jogo
const personalizar = document.getElementById("escolherJogo"); // div de selecionar fundos/skins

// // BOTAO DE RESTART ---------------------------------------- NOVO
// const restart = document.createElement("button");
// restart.id="btnRestart";
// restart.textContent = "Reiniciar";
// restart.style.position = "absolute";
// restart.style.top = "90.7%";
// restart.style.width = "10%";
// restart.style.left = "55%";

// SKINS DA BARATA
const barataPadrao = document.getElementById("barata_Padrao");
const barataRadioativa = document.getElementById("barata_Radioativa");
const barataCookie = document.getElementById("barata_Cookie");
const barataBrasil = document.getElementById("barata_Brasil");
const barataMinecraft = document.getElementById("barata_Minecraft");
const barataColorida = document.getElementById("barata_Colorida");

// FUNDOS
const cozinha = document.getElementById("fundo-cozinha");
const corredor = document.getElementById("fundo-corredor");
const mato = document.getElementById("fundo-mato"); 

// ------------------------------------------- TROCA AUTOMÁTICA DE FUNDOS (FASES) -------------------------------------------
let fundoscozinha = [
    'fundos/cozinha1.png',
    'fundos/cozinha2.png',
    'fundos/cozinha3.png',
    'fundos/cozinha4.png',
    'fundos/cozinha5.png',
];

let indiceFundo = 0;
let intervalofundo = null;

function trocadefundocozinha() {
    if (intervalofundo) return; // evita duplicar o intervalo

    intervalofundo = setInterval(() => {
        if (!jogoAtivo) {
            clearInterval(intervalofundo);
            return;
        }
        indiceFundo = (indiceFundo + 1) % fundoscozinha.length;
        fundo.src = fundoscozinha[indiceFundo];
    }, 60000); // troca a cada 1 minuto
}

// ----------------------------- DEFININDO DIMENSOES DO CANVAS E POSICOES  ---------------------------
let canvas = document.getElementById('joguinho');
let ctx = canvas.getContext('2d');
const larguraCanvas = canvas.width = 1000;
const alturaCanvas = canvas.height = 900;

// borda do canvas
ctx.strokeStyle = 'black';
ctx.lineWidth = 4;
ctx.strokeRect(0, 0, canvas.width, canvas.height);
canvas.style.display = 'none'; // inicialmente ele nao aparece

const lugaresx=[100,200,400,600,850]; //Definição dos arrays de posicao
const lugaresy=[400,600,800,660,460,860];
const lugaresycoracao=[500,300,700,560,760,360];

// ------------------------------------- VARIÁVEIS DE CONTROLE DO JOGO -----------------------------------
let frameAtual = 0;
let fundoY = 2;
let velocidade = 2;
// função para aumentar a velocidade do fundo e dos objetos
function aumentarVelocidade(){
    velocidade += 1;     // aumenta a velocidade do fundo
}
// ------------------------------------------- Velocidade fundo/ velocidade barata/ velocidade objeto ------------------------------------------
let intervalovelocidade = null;

// funções base do jogo de ganhar e perder ---------------------------------------------------------------------------------------------------
let jogoAtivo = true;

function ganhar() {
    jogoAtivo = false;
    mostrarAnimacaoVitoria(); // mostra o "filminho" de vitória
    clearInterval(intervalofundo);
    intervalofundo = null;
}

function perder() {
    jogoAtivo = false; // pausa tudo
    mostrarAnimacaoDerrota(); // mostra o "filminho" de derrota
    clearInterval(intervalofundo);
    intervalofundo = null;
}

function mostrarAnimacaoVitoria() {
    let imagens = [
        'imagens historia jogo/Barata ganhando imagem 1.png',
        'imagens historia jogo/Barata ganhando imagem 2.png',
        'imagens historia jogo/Barata ganhando 3.png',
    ];

    let indice = 0;
    let tempoPorQuadro = 300;

    let animacao = setInterval(() => {
        if (indice >= imagens.length) {
            clearInterval(animacao);
            ctx.font = "60px Arial";
            ctx.fillStyle = "green";
            ctx.textAlign = "center";
            ctx.fillText("VOCÊ VENCEU!", canvas.width / 2, canvas.height / 2);
            return;
        }

        let img = new Image();
        img.src = imagens[indice];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        indice++;
    }, tempoPorQuadro);
}
function mostrarAnimacaoDerrota() {
    let imagens = [
        'imagens historia jogo/barata perdendo 1.png',
        'imagens historia jogo/barata perdendo 2.png',
        'imagens historia jogo/barata perdendo 3.png'
    ];

    let indice = 0;
    let tempoPorQuadro = 350;

    let animacao = setInterval(() => {
        if (indice >= imagens.length) {
            clearInterval(animacao);
            ctx.font = "60px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            return;
        }

        let img = new Image();
        img.src = imagens[indice];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        indice++;
    }, tempoPorQuadro);
}
// ---------------------------------------- CRIAÇAO DOS SPRITES ----------------------------------------
let barataAnimada = null;

function criandoSprites(caminho, qtdeFrames, velocidadeSprite){
    const skin = new Image();
    skin.src = caminho;
    
    let sprites = {
        imagem: skin,
        qtdeFrames: qtdeFrames,
        larguraFrame: 0,
        alturaFrame: 0,
        velocidadeSprite: velocidadeSprite,
        imgCarregada: false
    };

    skin.onload = () => {
        sprites.imgCarregada = true;
        sprites.larguraFrame = skin.width / 2;
        sprites.alturaFrame = skin.height / qtdeFrames;
    };
    return sprites;
}

// funçao para desenhar os sprites
function desenharBarata(){
    if (!barataAnimada.imgCarregada) return;
    
    ctx.drawImage(
        barataAnimada.imagem,
        barataAnimada.larguraFrame, 
        barataAnimada.alturaFrame * frameAtual, 
        barataAnimada.larguraFrame, 
        barataAnimada.alturaFrame, 
        barata.x - 15, 
        barata.y, 
        700, 
        200
    );
    
    if (frameAtual < barataAnimada.qtdeFrames -1){
        frameAtual++;
    } else {
        frameAtual = 0;
    }
}

// ---------------------------------- DEFINIÇÃO DA BARATA E SUAS SKINS -------------------------------

function Barata(){
    this.x = 400;
    this.y = 600;
    this.velocidade = velocidade;
    this.largura = 60;
    this.altura = 60;
}

function andarbarata(){
  barata.velocidade = velocidade;
  barata.y -= barata.velocidade;
  
  if (barata.y < 0){
    barata.y = 900;
  }
}

let barata = new Barata(); 
let urlBarata = 'skins/barataBrasil.png'; // valor padrão
let urlFundo = 'fundos/cozinhasimples.jpg'; // valor padrão

barataPadrao.addEventListener("click", function(){ urlBarata = 'skins/barataBrasil.png'; });
barataRadioativa.addEventListener("click", function(){ urlBarata = 'skins/barataRadioativa.png'; });
barataCookie.addEventListener("click", function(){ urlBarata = 'skins/barataCookie.png'; });
barataBrasil.addEventListener("click", function(){ urlBarata = 'skins/barataBrasil.png'; });
barataMinecraft.addEventListener("click", function(){ urlBarata = 'skins/barataMinecraft.png'; });
barataColorida.addEventListener("click", function(){ urlBarata = 'skins/barataColorida.png'; });

// ------------------------------------------ DEFINIÇÃO DOS FUNDOS ------------------------------------
let fundo = new Image();

cozinha.addEventListener("click", function(){ urlFundo = 'fundos/cozinha1.png'; });
corredor.addEventListener("click", function(){ urlFundo = 'fundos/corredor.png'; });
mato.addEventListener("click", function(){ urlFundo = 'fundos/mato.jpg'; });

// ------------------------------------------- Definição dos Objetos ------------------------------
//----------------------- FUNÇÃO DO JOGO ------------------------------
let posicoesUsadasX = [];

function reposicionarObjeto(objeto) {
    objeto.x = gerarPosicaoUnica(lugaresx);
    objeto.y = lugaresy[Math.floor(Math.random() * lugaresy.length)];
}

// function jogo() // FUNÇÃO FEITA PRA CONSEGUIR VOLTAR O JOGO N BOTAO RESTART

function gerarPosicaoUnica(lugares) {
    if (posicoesUsadasX.length >= lugares.length) posicoesUsadasX = [];
    let posicao;
    do {
        posicao = lugares[Math.floor(Math.random() * lugares.length)];
    } while (posicoesUsadasX.includes(posicao));
    posicoesUsadasX.push(posicao);
    return posicao;
}

// CLASSE OBJETO 
function Objeto(y, urlImagem){
    this.imagem = new Image()
    this.imagem.src = urlImagem
    this.y = y;
    this.x = gerarPosicaoUnica(lugaresx);
    this.largura = 60;
    this.altura = 60;
    this.velocidade = velocidadeobjeto;

    this.desenhe = function(){
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    this.andarobjeto = function(){
        this.y += velocidadeobjeto;
        if (this.y>900){
            this.y=0;
            this.x = gerarPosicaoUnica(lugaresx);
    }
    }

    this.colideobjeto = function() {
        return (
            barata.x < this.x + this.largura &&
            barata.x + barata.largura > this.x &&
            barata.y < this.y + this.altura &&
            barata.y + barata.altura > this.y
        ); 
    }

    this.perderCoracao = function() {
        if (this.colideobjeto()){ 
            vida.pop();
            this.x = gerarPosicaoUnica(lugaresx);
            this.y = lugaresy[Math.floor(Math.random() * lugaresy.length)];
        }
    }}

let objeto1 = new Objeto(250,'fundos/mato.jpg')
let objeto2 = new Objeto(400,'fundos/cozinhasimples.jpg')
let objeto3 = new Objeto(600,'skins/iconBrasil.png')
let objeto4 = new Objeto(300,'skins/iconColorida.png')
// -------------------------------------------Vidas e corações---------------------------------------------
let vida = ['vida','vida','vida'];
const maxvidas = 3;

let imagemcoracao = new Image();
imagemcoracao.src = 'outras_imagens/coracao.png';

var retangulo_coracao = {
    x: lugaresx[Math.floor(Math.random() * lugaresx.length)],
    y: 400,
    largura: 50,
    altura: 50,
    velocidade: 2,
    desenhe: function() { ctx.drawImage(imagemcoracao, this.x, this.y, this.largura, this.altura); }
};

function andarcoracao(){
  retangulo_coracao.y += velocidade;
  if (retangulo_coracao.y>900){
    retangulo_coracao.y=0;
    retangulo_coracao.x = lugaresx[Math.floor(Math.random() * lugaresx.length)];
  }
}

function reposicionarcoracao(){
    retangulo_coracao.x = gerarPosicaoUnica(lugaresx); 
    retangulo_coracao.y = lugaresycoracao[Math.floor(Math.random() * lugaresycoracao.length)];
}

function colidecomcoracao() {
    return (
        barata.x < retangulo_coracao.x + retangulo_coracao.largura &&
        barata.x + barata.largura > retangulo_coracao.x &&
        barata.y < retangulo_coracao.y + retangulo_coracao.altura &&
        barata.y + barata.altura > retangulo_coracao.y
    ); 
}

function desenharVidas() {
    // 🔥 Garante que sempre apareça no topo (10 px de margem)
    for (let i = 0; i < vida.length && i < maxvidas; i++) {
        ctx.drawImage(imagemcoracao, 20 + i * 60, 60, 50, 50);
    }
}
// -------------------------------------------Controle de colisões----------------------------------------
let invencivel = false;
const tempoInvencivel = 600; 
let podePegarCoracao = true;
const tempoEsperaCoracao = 500;

function verificarColisoes() {
  if (invencivel || vida.length === 0) return;

  if (colideobjeto1()) perderVida(() => reposicionarobjeto1());
  else if (colideobjeto2()) perderVida(() => reposicionarobjeto2());
  else if (colideobjeto3()) perderVida(() => reposicionarobjeto3());
  else if (colideobjeto4()) perderVida(() => reposicionarobjeto4());
}

function perderVida(reposicionarFunc) {
  vida.pop();
  reposicionarFunc();
  invencivel = true;
  setTimeout(() => invencivel = false, tempoInvencivel);
}

function pegarCoracao() {
  if (!podePegarCoracao) return;
  if (colidecomcoracao()) {
    if (vida.length < maxvidas) {
      vida.push('vida');
      reposicionarcoracao();
      podePegarCoracao = false;
      setTimeout(() => podePegarCoracao = true, tempoEsperaCoracao);
    }
  }
}

// -------------------------------------------Função de desenho da cena----------------------------------------
function desenharcena() {
    if (!jogoAtivo) return; // se o jogo acabou, não continua
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fundoY += velocidade;
    fundoY = (fundoY + velocidade) % canvas.height;
    ctx.drawImage(fundo, 0, -fundoY, canvas.width, canvas.height);
    ctx.drawImage(fundo, 0, canvas.height - fundoY, canvas.width, canvas.height);

    if (vida.length < maxvidas) {
        retangulo_coracao.desenhe();
        andarcoracao();
        pegarCoracao();
    }

    if (vida.length > 0) {
        objeto1.desenhe(); objeto1.andarobjeto(); objeto1.perderCoracao(); 
        objeto2.desenhe(); objeto2.andarobjeto(); objeto2.perderCoracao();
        objeto3.desenhe(); objeto3.andarobjeto(); objeto3.perderCoracao();
        objeto4.desenhe(); objeto4.andarobjeto(); objeto4.perderCoracao();
    } else {
       perder();
        botaoVoltar.style.width = "20%";
        botaoVoltar.style.right = "10%";
        document.body.appendChild(restart)
        restart.addEventListener("click", function(){
        restart.remove()
        reiniciar()
        });
    }

    verificarColisoes();
    desenharBarata();
    desenharVidas();


    requestAnimationFrame(desenharcena);
}

// -------------------------------------------Início do jogo----------------------------------------
jogar.addEventListener("click", function(){
    personalizar.style.display = 'none';
    canvas.style.display = 'block';
     botaoVoltar.style.position = "relative";
    botaoVoltar.style.top = "90%";
    barataAnimada = criandoSprites(urlBarata,9,100);
    fundo.src = urlFundo;
    
   if (fundo.src.includes('fundos/cozinha1.png')) {
    trocadefundocozinha();
    }


    desenharcena();

     // ✅ Evita múltiplos intervals
    if (!intervalovelocidade) {
        intervalovelocidade = setInterval(aumentarVelocidade, 10000);
    }


    setTimeout(() => {invencivel = false;}, 3000);
    setTimeout(() => {if (vida.length > 0 && jogoAtivo) {
    ganhar(); // já chama a animação dentro
    }
}, 250000);
});

// -------------------------------- MOVIMENTO DA BARATA --------------------------------
const pontosx = [100, 200, 400, 600, 850];
document.addEventListener('keydown', function(e) {
    if (!jogoAtivo) return;
    let index = pontosx.indexOf(barata.x);
    if (e.key === 'ArrowLeft' && index > 0) barata.x = pontosx[index - 1];
    if (e.key === 'ArrowRight' && index < pontosx.length - 1 && index !== -1) barata.x = pontosx[index + 1];
});
// -------------------- FUNÇÃO DE REINICIAR -----------------------

function reiniciar(){
    vida = ['vida','vida','vida'];
    podePegarCoracao = true;
    invencivel = false;
    barata.x = 400;
    barata.y = 600;
    
    fundoY = 2;
    velocidade = 2;
    frameAtual = 0
    clearInterval(velocidadeAumentada);
    velocidadeAumentada = setInterval(aumentarvelocidade, 30000);
    jogo();
}
