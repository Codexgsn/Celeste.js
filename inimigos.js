// Os inimigos são desenhados num canvas próprio, por cima do canvas do jogo
const canvasInimigos = document.getElementById("canvasInimigos");
canvasInimigos.width = 1200;
canvasInimigos.height = 720;
const contextoInimigos = canvasInimigos.getContext("2d");

const imagemVerde = new Image();
imagemVerde.src = "assets/monstro_verde.png";

const imagemRoxa = new Image();
imagemRoxa.src = "assets/monstro_roxo.png";

// Tipos de monstro:
// "andador"  -> anda de um lado pro outro na plataforma
// "saltador" -> pula na direção do jogador
// "voador"   -> voa de um lado pro outro subindo e descendo
class Monstro {
    constructor(tipo, posicaoX, chao, limiteEsquerdo, limiteDireito) {
        this.tipo = tipo;
        this.largura = 52;
        this.altura = 65;
        this.posicaoX = posicaoX;
        this.posicaoY = chao - this.altura; // deixa os pés no chão
        this.chao = this.posicaoY;
        this.limiteEsquerdo = limiteEsquerdo;
        this.limiteDireito = limiteDireito;
        this.direcao = 1; // 1 = direita, -1 = esquerda
        this.velocidadeY = 0;
        this.tempo = 0; // conta os quadros
        this.vivo = true;
    }

    // Anda e vira quando chega na borda da plataforma
    andar() {
        this.posicaoX += this.direcao * 0.8;

        if (this.posicaoX < this.limiteEsquerdo) this.direcao = 1;
        if (this.posicaoX + this.largura > this.limiteDireito) this.direcao = -1;
    }

    atualizar() {
        this.tempo++;

        if (this.tipo === "saltador") {
            if (this.posicaoY < this.chao) {
                // No ar: anda e cai
                this.andar();
                this.velocidadeY += 0.45;
            } else if (this.tempo % 75 === 0) {
                // No chão: a cada 75 quadros pula na direção do jogador
                this.direcao = player.pos_x < this.posicaoX ? -1 : 1;
                this.velocidadeY = -8;
            }

            this.posicaoY += this.velocidadeY;

            // Voltou pro chão
            if (this.posicaoY > this.chao) {
                this.posicaoY = this.chao;
                this.velocidadeY = 0;
            }
        } else {
            // Andador e voador viram sozinhos de vez em quando
            if (Math.random() < 0.005) this.direcao *= -1;
            this.andar();
        }

        if (this.tipo === "voador") {
            this.posicaoY = this.chao + Math.sin(this.tempo / 38) * 35; // sobe e desce

            // A cada 240 quadros cospe fogo no jogador (1.0 = velocidade do fogo)
            if (this.tempo % 240 === 0) {
                cuspirFogoNoJogador(this, 1);
            }
        }
    }

    desenhar() {
        // A imagem tem 4 colunas e 2 linhas de quadros (64 x 80 cada)
        let coluna = Math.floor(this.tempo / 14) % 3; // anima os quadros 0, 1 e 2
        if (this.tipo === "saltador") coluna = 3; // quadro de boca aberta

        const linha = this.direcao === -1 ? 1 : 0; // esquerda ou direita
        const imagem = this.tipo === "voador" ? imagemRoxa : imagemVerde;

        contextoInimigos.drawImage(
            imagem,
            coluna * 64, linha * 80, 64, 80,
            this.posicaoX, this.posicaoY, this.largura, this.altura
        );
    }
}

// Monstros da fase.
// Valores: tipo, x inicial, y do chão, limite esquerdo e limite direito da plataforma.
let monstros = [
    // chão
    new Monstro("andador", 226, 608, 86, 445),
    new Monstro("andador", 872, 608, 718, 1077),
    new Monstro("saltador", 560, 608, 467, 682),

    // plataformas
    new Monstro("andador", 226, 490, 104, 352),
    new Monstro("saltador", 467, 396, 360, 606),
    new Monstro("andador", 765, 325, 657, 914),
    new Monstro("saltador", 1005, 467, 894, 1128),
    new Monstro("andador", 298, 253, 190, 422),

    // voadores (aqui o y é a altura do voo)
    new Monstro("voador", 228, 218, 36, 467),
    new Monstro("voador", 659, 233, 431, 897),
    new Monstro("voador", 1018, 295, 825, 1163)
];

let chefe = null; // aparece quando todos os monstros morrem

let fogos = []; // bolas de fogo dos voadores e do boss

// Cospe uma bola de fogo do centro do inimigo na direção do jogador
// velocidade = quantos px a bola anda por quadro
function cuspirFogoNoJogador(inimigo, velocidade) {
    const posicaoX = inimigo.posicaoX + inimigo.largura / 2;
    const posicaoY = inimigo.posicaoY + inimigo.altura / 2;
    const distanciaX = player.pos_x + player.width / 2 - posicaoX;
    const distanciaY = player.pos_y + player.height / 2 - posicaoY;
    const distancia = Math.hypot(distanciaX, distanciaY); // distância em linha reta

    fogos.push({
        x: posicaoX,
        y: posicaoY,
        velocidadeX: distanciaX / distancia * velocidade,
        velocidadeY: distanciaY / distancia * velocidade
    });
}

// O tiro acerta quando o ponto dele está dentro do retângulo do inimigo
function acertou(tiro, inimigo) {
    return tiro.x > inimigo.posicaoX &&
        tiro.x < inimigo.posicaoX + inimigo.largura &&
        tiro.y > inimigo.posicaoY &&
        tiro.y < inimigo.posicaoY + inimigo.altura;
}

// Loop dos inimigos: roda junto com o loop do jogo
function animarInimigos() {
    contextoInimigos.clearRect(0, 0, 1200, 720);

    // Só funciona depois de apertar Enter e a fase carregar (variáveis do script.js)
    if (gameStatus === "playing" && phaseReady) {
        for (const monstro of monstros) {
            monstro.atualizar();
            monstro.desenhar();
        }

        if (chefe) {
            chefe.atualizar();
            chefe.desenhar();
        }

        // Move e desenha as bolas de fogo
        contextoInimigos.fillStyle = "orange";
        for (const fogo of fogos) {
            fogo.x += fogo.velocidadeX;
            fogo.y += fogo.velocidadeY;

            contextoInimigos.beginPath();
            contextoInimigos.arc(fogo.x, fogo.y, 7, 0, Math.PI * 2);
            contextoInimigos.fill();
        }

        // Tira as bolas de fogo que saíram da tela
        fogos = fogos.filter(fogo => fogo.x > 0 && fogo.x < 1200 && fogo.y > 0 && fogo.y < 720);

        // Confere se os tiros do jogador acertaram alguém
        for (const tiro of player.projeteis) {
            for (const monstro of monstros) {
                if (acertou(tiro, monstro)) {
                    monstro.vivo = false;
                    tiro.usado = true;
                }
            }

            // O boss só leva dano depois de terminar de aparecer
            if (chefe && chefe.vivo && chefe.tempo > 240 && acertou(tiro, chefe)) {
                chefe.levarDano();
                tiro.usado = true;
            }
        }

        // Tira os monstros mortos e os tiros que já acertaram
        monstros = monstros.filter(monstro => monstro.vivo);
        player.projeteis = player.projeteis.filter(tiro => !tiro.usado);

        if (monstros.length === 0 && !chefe) {
            chefe = new Boss();
        }

        // Texto no canto da tela (a vida do boss aparece na barra dele)
        contextoInimigos.fillStyle = "white";
        contextoInimigos.font = "20px monospace";
        if (!chefe) {
            contextoInimigos.fillText("Inimigos: " + monstros.length, 20, 30);
        } else if (!chefe.vivo) {
            contextoInimigos.fillText("Boss derrotado!", 20, 30);
        }

        // Colisão do jogador com monstros
        for (const monstro of monstros) {
            if (
                player.pos_x < monstro.posicaoX + monstro.largura &&
                player.pos_x + player.width > monstro.posicaoX &&
                player.pos_y < monstro.posicaoY + monstro.altura &&
                player.pos_y + player.height > monstro.posicaoY
            ) {
                player.levarDano();
            }
        }

        // Colisão do jogador com as bolas de fogo
        for (const fogo of fogos) {
            if (
                fogo.x > player.pos_x &&
                fogo.x < player.pos_x + player.width &&
                fogo.y > player.pos_y &&
                fogo.y < player.pos_y + player.height
            ) {
                player.levarDano();
                fogo.atingiu = true; // marca a bola de fogo como atingida para removê-la
            }
        }

        fogos = fogos.filter(fogo => !fogo.atingiu); // remove as bolas de fogo que atingiram o jogador

        // Colisão com o chefe (se ativo)
        if (chefe && chefe.vivo &&
            player.pos_x < chefe.posicaoX + chefe.largura &&
            player.pos_x + player.width > chefe.posicaoX &&
            player.pos_y < chefe.posicaoY + chefe.altura &&
            player.pos_y + player.height > chefe.posicaoY
        ) {
            player.levarDano();
        }   
    }

    requestAnimationFrame(animarInimigos);
}

// Começa o loop quando a página terminar de carregar
window.addEventListener("load", animarInimigos);
