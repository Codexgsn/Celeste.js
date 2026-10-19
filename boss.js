// Boss: um monstro roxo grande que anda no alto e atira no jogador
class Boss {
    constructor() {
        this.largura = 120;
        this.altura = 150;
        this.posicaoX = 540;
        this.posicaoY = 130;
        this.vida = 15;
        this.vivo = true;
        this.direcao = 1; // 1 = direita, -1 = esquerda
        this.tempo = 0; // conta os quadros
        this.tiros = [];
    }

    update() {
        if (!this.vivo) return;
        this.tempo++;

        // Quanto menos vida, mais rápido ele anda e atira
        let velocidade = 1.5;
        let tempoEntreTiros = 150;
        if (this.vida <= 10) {
            velocidade = 2;
            tempoEntreTiros = 120;
        }
        if (this.vida <= 5) {
            velocidade = 2.5;
            tempoEntreTiros = 90;
        }

        // Anda de um lado pro outro da tela
        this.posicaoX += this.direcao * velocidade;
        if (this.posicaoX < 0) this.direcao = 1;
        if (this.posicaoX + this.largura > 1200) this.direcao = -1;

        if (this.tempo % tempoEntreTiros === 0) this.atirar();

        // Move os tiros
        for (const tiro of this.tiros) {
            tiro.x += tiro.velocidadeX;
            tiro.y += tiro.velocidadeY;
        }

        // Tira os tiros que saíram da tela
        this.tiros = this.tiros.filter(tiro => tiro.x > 0 && tiro.x < 1200 && tiro.y > 0 && tiro.y < 720);
    }

    // O tiro sai do meio do boss e vai em linha reta até o meio do jogador
    atirar() {
        const x = this.posicaoX + this.largura / 2;
        const y = this.posicaoY + this.altura / 2;

        this.tiros.push({
            x: x,
            y: y,
            velocidadeX: (player.pos_x + player.width / 2 - x) / 100, // chega em 100 quadros
            velocidadeY: (player.pos_y + player.height / 2 - y) / 100
        });
    }

    // Chamado quando o tiro do jogador acerta o boss
    levarDano() {
        this.vida--;
        if (this.vida === 0) {
            this.vivo = false;
            this.tiros = [];
        }
    }

    draw() {
        if (!this.vivo) return;

        // Usa a imagem do monstro roxo (do inimigos.js), só que maior
        const coluna = Math.floor(this.tempo / 16) % 4;
        let linha = 0; // linha de cima olha pra direita
        if (this.direcao === -1) linha = 1; // linha de baixo olha pra esquerda

        ctxInimigos.drawImage(
            spriteRoxo,
            coluna * 64, linha * 80, 64, 80,
            this.posicaoX, this.posicaoY, this.largura, this.altura
        );

        // Tiros: quadradinhos laranja
        ctxInimigos.fillStyle = "orange";
        for (const tiro of this.tiros) {
            ctxInimigos.fillRect(tiro.x - 7, tiro.y - 7, 14, 14);
        }
    }
}
