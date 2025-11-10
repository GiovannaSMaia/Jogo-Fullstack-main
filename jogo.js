// ----------- PEGANDO TODOS OS ELEMENTOS HTML -------------------------------

const jogar = document.getElementById("botao_jogar");
const personalizar = document.getElementById("escolherJogo");
const botaoTutorial = document.getElementById("tutorial")
const displayTutorial = document.getElementById("sobrepor")
const botaoFecharTutorial = document.getElementById("fecharTutorial")
const displayMenu = document.getElementsByClassName("menuJogo") 

// HTML: sons

const somMorreu = new Audio("sons/morreu.mp3")
const somLevouHit = new Audio("sons/levou_hit.mp3")
const somPegouCoracao = new Audio("sons/pegou_coracao.mp3")
const somMusica = new Audio("sons/musica.mp3")

// HTML: SEÇÃO DE COMO JOGAR

displayTutorial.style.display = "none"

botaoTutorial.addEventListener("click", function(){
    displayTutorial.style.display = "block"
})

botaoFecharTutorial.addEventListener("click", function(){
    displayTutorial.style.display = "none"
})

// ESTILIZANDO BOTOES DE ESCOLHA

const btnEscolher = document.getElementsByClassName("escolher")


let qtde_clicados = []

for (let btn of btnEscolher){

    btn.addEventListener("click", function(){
        const tipoBotao = btn.closest("#escolherSkin,#escolherFundo").id;

    if (btn.style.transform === "scale(1.2)"){
        btn.style.transform = "none"

        for (let clicado = 0;clicado < qtde_clicados.length;clicado++){
            if (qtde_clicados[clicado].botao === btn){
                qtde_clicados.splice(clicado, 1);
                break
        }
      }
      return;
    }
    for(let item of qtde_clicados) {
      if (item.tipo === tipoBotao) {
        item.botao.style.transform = "none";
      }
    }
    qtde_clicados.push({ botao: btn, tipo: tipoBotao });
    btn.style.transform = "scale(1.2)";
})}
    
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
const esgoto = document.getElementById("fundo-esgoto1"); 

// ------------------------------------------- TROCA AUTOMÁTICA DE FUNDOS (FASES) -------------------------------------------
let fundoscozinha = [
    'fundos/cozinha1.jpg',
    'fundos/cozinha2.png',
    'fundos/cozinha3.png',
    'fundos/cozinha4.png',
    'fundos/cozinha5.png',
];
let fundosmato = [
    'fundos/mato.jpg',
    'fundos/mato2.jpg',
    'fundos/mato3.jpg',
    'fundos/mato4.jpg',
    'fundos/mato5.jpg',
];
let fundoscorredor = [
    'fundos/corredor.png',
    'fundos/corredor2.jpg',
    'fundos/corredor3.jpg',
    'fundos/corredor4.jpg',
    'fundos/corredor5.png',
];
let fundosesgoto = [
    'fundos/esgoto1.jpg',
    'fundos/esgoto2.jpg',
    'fundos/esgoto3.jpg',
    'fundos/esgoto4.jpg',
    'fundos/esgoto5.jpg',
];
let indiceFundo = 0;
let intervalofundo = null;

// funções de troca de fundo corrigidas
function trocadefundocozinha() {
    if (intervalofundo) return;
    intervalofundo = setInterval(() => {
        if (!jogoAtivo) { clearInterval(intervalofundo); intervalofundo=null; return; }
        indiceFundo = (indiceFundo + 1) % fundoscozinha.length;
        fundo.src = fundoscozinha[indiceFundo];
    }, 60000);
}
function trocadefundocorredor() {
    if (intervalofundo) return;
    intervalofundo = setInterval(() => {
        if (!jogoAtivo) { clearInterval(intervalofundo); intervalofundo=null; return; }
        indiceFundo = (indiceFundo + 1) % fundoscorredor.length;
        fundo.src = fundoscorredor[indiceFundo];
    }, 60000);
}
function trocadefundomato() {
    if (intervalofundo) return;
    intervalofundo = setInterval(() => {
        if (!jogoAtivo) { clearInterval(intervalofundo); intervalofundo=null; return; }
        indiceFundo = (indiceFundo + 1) % fundosmato.length;
        fundo.src = fundosmato[indiceFundo];
    }, 60000);
}
function trocadefundoesgoto() {
    if (intervalofundo) return;
    intervalofundo = setInterval(() => {
        if (!jogoAtivo) { clearInterval(intervalofundo); intervalofundo=null; return; }
        indiceFundo = (indiceFundo + 1) % fundosesgoto.length;
        fundo.src = fundosesgoto[indiceFundo];
    }, 60000);
}
// ----------------------------- DEFININDO DIMENSOES DO CANVAS E POSICOES  ---------------------------
let canvas = document.getElementById('joguinho');
let ctx = canvas.getContext('2d');
const larguraCanvas = canvas.width = 900;
const alturaCanvas = canvas.height = 700;

ctx.strokeStyle = 'black';
ctx.lineWidth = 4;
ctx.strokeRect(0, 0, canvas.width, canvas.height);
canvas.style.display = 'none';

const lugaresx=[100,200,400,600,700];
const lugaresy=[400,600,800,660,460,860];
const lugaresycoracao=[500,300,700,560,760,360];

let frameAtual = 0;
let fundoY = 2;
let velocidade = 2;
let velocidadeFundo = 2;
let tempoUltimoAumento = Date.now();

function aumentarvelocidade(){ velocidade += 1; }
let velocidadeAumentada = null;
let timeoutVitoria = null;
let intervalovelocidade = null;
let jogoAtivo = true;

// Variáveis para controlar animações e timeouts
let animacaoVitoriaTimeouts = [];
let animacaoDerrotaInterval = null;

// ------------------------------------------- Funções de vitória e derrota ------------------------------------------
function ganhar() {
    jogoAtivo = false;
    cancelAnimationFrame(idCancelarAnimacao);

    clearInterval(intervalofundo); intervalofundo = null;
    clearInterval(intervalovelocidade); intervalovelocidade = null;

    mostrarAnimacaoVitoria();
    somMusica.pause();
}

function perder() {
    jogoAtivo = false;
    mostrarAnimacaoDerrota();
    clearInterval(intervalofundo); intervalofundo = null;
    somMorreu.play();
    somMusica.pause();
}

// ------------------------------------------- Animações ------------------------------------------
function mostrarAnimacaoVitoria() {
    let imagens = [
        'imagens historia jogo/Barata ganhando imagem 1.png',
        'imagens historia jogo/Barata ganhando imagem 2.png',
        'imagens historia jogo/Barata ganhando 3.png',
    ];

    let indice = 0;
    const tempoPorQuadro = 300;
    let ultimaImagem = null;

    function proximoQuadro() {
        if (indice >= imagens.length) {
            if (ultimaImagem) ctx.drawImage(ultimaImagem, 0, 0, canvas.width, canvas.height);
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
            ultimaImagem = img;
            indice++;
            const t = setTimeout(proximoQuadro, tempoPorQuadro);
            animacaoVitoriaTimeouts.push(t);
        };
    }

    proximoQuadro();
}

function mostrarAnimacaoDerrota() {
    let imagens = [
        'imagens historia jogo/barata perdendo 1.png',
        'imagens historia jogo/barata perdendo 2.png',
        'imagens historia jogo/barata perdendo 3.png'
    ];

    let indice = 0;
    let tempoPorQuadro = 350;

    if (animacaoDerrotaInterval) clearInterval(animacaoDerrotaInterval);

    animacaoDerrotaInterval = setInterval(() => {
        if (indice >= imagens.length) {
            clearInterval(animacaoDerrotaInterval);
            animacaoDerrotaInterval = null;
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

function animacaoIntroducao(callback) {
    let imagens = [
        'imagens historia jogo/intro 1.png',
        'imagens historia jogo/intro 2.png',
        'imagens historia jogo/intro 3.png',
        'imagens historia jogo/intro 4.png',
        'imagens historia jogo/intro 5.png',
    ];

    let indice = 0;
    const tempoPorQuadro = 400; // tempo entre os frames

    function proximoQuadro() {
        if (indice >= imagens.length) {
            callback(); // inicia o jogo quando terminar
            return;
        }

        let img = new Image();
        img.src = imagens[indice];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            indice++;
            setTimeout(proximoQuadro, tempoPorQuadro);
        };
    }

    proximoQuadro();
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
        sprites.larguraFrame = skin.width / 2.1;
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
        barata.x - 40, 
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
    this.y = 500;
    this.velocidade = velocidade;
    this.largura = 60;
    this.altura = 60;
}

let barata = new Barata(); 
let urlBarata = 'skins/barataPadrao.png'; // valor padrão
let urlFundo = 'fundos/cozinha1.jpg'; // valor padrão

barataPadrao.addEventListener("click", function(){ urlBarata = 'skins/barataPadrao.png'; });
barataRadioativa.addEventListener("click", function(){ urlBarata = 'skins/barataRadioativa.png'; });
barataCookie.addEventListener("click", function(){ urlBarata = 'skins/barataCookie.png'; });
barataBrasil.addEventListener("click", function(){ urlBarata = 'skins/barataBrasil.png'; });
barataMinecraft.addEventListener("click", function(){ urlBarata = 'skins/barataMinecraft.png'; });
barataColorida.addEventListener("click", function(){ urlBarata = 'skins/barataColorida.png'; });

// ------------------------------------------ DEFINIÇÃO DOS FUNDOS ------------------------------------
let fundo = new Image();

cozinha.addEventListener("click", function(){ urlFundo = 'fundos/cozinha1.jpg'; });
corredor.addEventListener("click", function(){ urlFundo = 'fundos/corredor.png'; });
mato.addEventListener("click", function(){ urlFundo = 'fundos/mato.jpg'; });
esgoto.addEventListener("click", function(){ urlFundo = 'fundos/esgoto1.jpg'; });


//----------------------- FUNÇÃO DO JOGO ------------------------------
let posicoesUsadasX = [];

function reposicionarObjeto(objeto) {
    objeto.x = gerarPosicaoUnica(lugaresx);
    objeto.y = lugaresy[Math.floor(Math.random() * lugaresy.length)];
}

function jogo(){ 
somMusica.play()
somMusica.loop = true;
// ------------------------------------------- Definição dos Objetos ------------------------------
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
    this.velocidade = velocidade;

    this.desenhe = function(){
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    this.andarobjeto = function(){
        this.y += velocidade;
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

let objeto1 = new Objeto(250,'outras_imagens/faca.png')
let objeto2 = new Objeto(400,'outras_imagens/copo.png')
let objeto3 = new Objeto(600,'outras_imagens/panelinha.png')
let objeto4 = new Objeto(300,'outras_imagens/garrafa.png')

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
    for (let i = 0; i < vida.length && i < maxvidas; i++){
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

  if (objeto1.colideobjeto()) perderVida(() => reposicionarobjeto(objeto1));
  else if (objeto2.colideobjeto()) perderVida(() => reposicionarobjeto(objeto2));
  else if (objeto3.colideobjeto()) perderVida(() => reposicionarobjeto(objeto3));
  else if (objeto4.colideobjeto()) perderVida(() => reposicionarobjeto(objeto4));
}

function perderVida(reposicionarFunc) {
  vida.pop();
  somLevouHit.cloneNode().play();
  reposicionarFunc();
  invencivel = true;
  setTimeout(() => invencivel = false, tempoInvencivel);
}

function pegarCoracao() {
  if (!podePegarCoracao) return;
  if (colidecomcoracao()) {
      if (vida.length < maxvidas) {
        somPegouCoracao.cloneNode().play();
        vida.push('vida');
        reposicionarcoracao();
        podePegarCoracao = false;
        setTimeout(() => podePegarCoracao = true, tempoEsperaCoracao);
    }
    }
}

// -------------------------------------------Função de desenho da cena----------------------------------------
desenharcena()
function desenharcena() {
    if (!jogoAtivo) return;
    
    const agora = Date.now();
    const tempoDecorrido = (agora - tempoUltimoAumento) / 1000; // segundos desde último aumento

    // A cada 10 segundos, aumenta um pouco a velocidade
    if (tempoDecorrido >= 10) {
        velocidade += 1; // aumenta suavemente
        velocidadeFundo += 1; // aumenta suavemente
        tempoUltimoAumento = agora;
    }

    // Movimento suave do fundo
    fundoY -= velocidadeFundo;
    if (fundoY <= -canvas.height) {
        fundoY = 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(fundo, 0, fundoY, canvas.width, canvas.height);
    ctx.drawImage(fundo, 0, fundoY + canvas.height, canvas.width, canvas.height);

    if (vida.length < maxvidas) {
        retangulo_coracao.desenhe();
        andarcoracao();
        pegarCoracao();
    }

    if (vida.length > 0) {
        objeto1.desenhe(); objeto1.andarobjeto(); objeto1.perderCoracao(); // SUBSTITUI TUDO QUE É RETANGULO OBJETO POR OBJETO1234 ETC
        objeto2.desenhe(); objeto2.andarobjeto(); objeto2.perderCoracao();
        objeto3.desenhe(); objeto3.andarobjeto(); objeto3.perderCoracao();
        objeto4.desenhe(); objeto4.andarobjeto(); objeto4.perderCoracao();
    } else {
        perder();
        return;
    }

    verificarColisoes();
    desenharBarata();
    desenharVidas();

    if (barata.y <= 0) barata.y = canvas.height;


    idCancelarAnimacao = requestAnimationFrame(desenharcena);
}

// controle de movimentação----------------------------------------------------------------------------

 const pontosx = [100,200,400,600,700];
    document.addEventListener('keydown', function(evento){
           barata.x = Math.round(barata.x);

    // encontra a posição mais próxima de barata.x
    let index = pontosx.reduce((maisProx, x, i) =>
        Math.abs(x - barata.x) < Math.abs(pontosx[maisProx] - barata.x) ? i : maisProx
    , 0);

    // move para a esquerda/direita dentro dos limites
    if (evento.key === 'ArrowLeft' && index > 0) barata.x = pontosx[index - 1];
    if (evento.key === 'ArrowRight' && index < pontosx.length - 1) barata.x = pontosx[index + 1];
    });
}

// --------------------- Início do jogo-----------------------------

jogar.addEventListener("click", function() {
    for (let elemento of displayMenu){
        elemento.style.display = "none"
    }
    canvas.style.display = 'block';

    let botaoMenuJogo = document.createElement("button");
    botaoMenuJogo.id = "botaoVoltarJogo";
    botaoMenuJogo.textContent = "Voltar ao menu do jogo";
    
    botaoMenuJogo.addEventListener("click", function(){
        window.location.href = "jogo.html"
    })
    document.body.appendChild(botaoMenuJogo)

    barataAnimada = criandoSprites(urlBarata, 9, 100);
    fundo.src = urlFundo;

    // Troca de fundo automática 
    if (intervalofundo) {
    clearInterval(intervalofundo);
    intervalofundo = null;
    }

    if (urlFundo.includes('cozinha')) trocadefundocozinha();
    else if (urlFundo.includes('corredor')) trocadefundocorredor();
    else if (urlFundo.includes('mato')) trocadefundomato();
    else if (urlFundo.includes('esgoto1')) trocadefundoesgoto();

    // Aumenta a velocidade a cada 10 segundos
    
    // Função que começa o jogo depois da animação
    function iniciarJogoAposIntro() {
        invencivel = true;
        setTimeout(() => { invencivel = false; }, 3000);

           
        jogo();
        if (jogoAtivo) {setInterval(() => {
            if (jogoAtivo) {
                aumentarvelocidade();
                console.log("Velocidade aumentada:", velocidade);
            }
        }, 10000);
    }
        setTimeout(() => {if (jogoAtivo) {
        ganhar(); // já chama a animação dentro
        }
    }, 250000);
    }

    // 🔹 Exibe a animação, depois inicia o jogo
    animacaoIntroducao(iniciarJogoAposIntro);
});

   






