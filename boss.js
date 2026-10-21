// Boss: um monstro roxo grande que aparece quando todos os monstros morrem.
// Ele repete: voa de um lado pro outro cuspindo fogo no jogador,
// depois para onde está e cospe círculos de fogo.
// Com 1 de vida ele para e cospe círculos de fogo sem parar.
class Boss {
    constructor() {
        this.largura = 120;
        this.altura = 150;
        this.posicaoX = 540; // meio da tela
        this.posicaoY = 150;
        this.vida = 15;
        this.vivo = true;
        this.direcao = 1; // 1 = direita, -1 = esquerda
        this.tempo = 0; // quadros desde que o boss foi criado
    }

    atualizar() {
        if (!this.vivo) return;
        this.tempo++;

        // Nos primeiros 240 quadros ele só está aparecendo
        if (this.tempo < 240) return;

        const raiva = 15 - this.vida; // cresce a cada dano: fica mais rápido

        if (this.vida === 1) {
            // Última vida: para e cospe círculos de fogo sem parar
            if (this.tempo % 90 === 0) this.circuloDeFogo(0.4);
        } else if (this.tempo % 800 < 400) {
            // 400 quadros voando de um lado pro outro
            this.posicaoX += this.direcao * (1 + raiva * 0.1);
            if (this.posicaoX < 0) this.direcao = 1;
            if (this.posicaoX + this.largura > 1200) this.direcao = -1;

            // Cospe fogo no jogador (0.5 = velocidade do fogo)
            if (this.tempo % (200 - raiva * 8) === 0) {
                cuspirFogoNoJogador(this, 0.5);
            }
        } else if (this.tempo % (160 - raiva * 6) === 0) {
            // 400 quadros parado onde está, cuspindo círculos de fogo
            this.circuloDeFogo(0.5);
        }
    }

    // Cospe 16 bolas de fogo em círculo, saindo do meio do boss
    // velocidade = quantos px cada bola anda por quadro
    circuloDeFogo(velocidade) {
        for (let bola = 0; bola < 16; bola++) {
            const angulo = bola * Math.PI / 8; // 16 bolas = uma a cada 22,5 graus

            fogos.push({
                x: this.posicaoX + this.largura / 2,
                y: this.posicaoY + this.altura / 2,
                velocidadeX: Math.cos(angulo) * velocidade,
                velocidadeY: Math.sin(angulo) * velocidade
            });
        }
    }

    // Chamado quando o tiro do jogador acerta o boss
    levarDano() {
        this.vida--;
        if (this.vida === 0) {
            this.vivo = false;
            fogos = []; // o fogo some junto com o boss
        }
    }

    desenhar() {
        if (!this.vivo || this.tempo < 90) return;

        // Primeiro aparece a barra de vida, no alto da tela
        contextoInimigos.fillStyle = "black";
        contextoInimigos.fillRect(400, 50, 400, 20);
        contextoInimigos.fillStyle = "red";
        contextoInimigos.fillRect(400, 50, 400 * this.vida / 15, 20); // tamanho conforme a vida
        contextoInimigos.strokeStyle = "white";
        contextoInimigos.strokeRect(400, 50, 400, 20);

        // Logo depois aparece o boss, começando borrado e ficando nítido
        if (this.tempo < 150) return;
        if (this.tempo < 240) {
            contextoInimigos.filter = "blur(" + (240 - this.tempo) / 4 + "px)";
        }

        // Usa a imagem do monstro roxo (do inimigos.js), só que maior
        const coluna = Math.floor(this.tempo / 16) % 4;
        const linha = this.direcao === -1 ? 1 : 0; // esquerda ou direita

        contextoInimigos.drawImage(
            imagemRoxa,
            coluna * 64, linha * 80, 64, 80,
            this.posicaoX, this.posicaoY, this.largura, this.altura
        );

        contextoInimigos.filter = "none"; // tira o borrão pro resto do desenho
    }
}
