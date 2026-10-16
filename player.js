class Player{
    // aqui ficam as informações do jogador
    width = 50;
    height = 50;
    pos_x = 550;
    pos_y = 558;
    speed = 6.5;
    velocityY = 0;
    gravity = 0.2;
    jumpForce = 8;
    onGround = true;
    jumpWasDown = false;
    keys = {};

    // função que mostra o jogador na tela
    drawPlayer(){
        ctx.fillStyle = "red";

        ctx.fillRect(
            this.pos_x,
            this.pos_y,
            this.width,
            this.height
        )
    }

    // função que faz o jogador andar e pular pelo canvas
    updatePlayer(platforms){

        if(this.keys["ArrowRight"] || this.keys["d"]){
            this.pos_x += this.speed;
        }
        

        if(this.keys["ArrowLeft"] || this.keys["a"]){
            this.pos_x -= this.speed;
        }

        const jumpKeyDown = this.keys["ArrowUp"] || this.keys["w"];

        if(jumpKeyDown && !this.jumpWasDown && this.onGround){
            this.velocityY = -this.jumpForce;
            this.onGround = false;
        }

        this.jumpWasDown = jumpKeyDown;

        // Mantém o jogador dentro das bordas do canvas.
        this.pos_x = Math.max(0, Math.min(this.pos_x, canvas.width - this.width));

        // Guarda a posição dos pés antes do movimento para detectar se cruzaram uma plataforma.
        const previousBottom = this.pos_y + this.height;
        this.velocityY += this.gravity;
        this.pos_y += this.velocityY;
        this.onGround = false;

        for (const platform of platforms) {
            const overlapsHorizontally =
                this.pos_x < platform.x + platform.width &&
                this.pos_x + this.width > platform.x;
            const currentBottom = this.pos_y + this.height;

            if (
                // Aterrissa apenas ao cair, vindo de cima e sobrepondo a plataforma na horizontal.
                this.velocityY >= 0 &&
                previousBottom <= platform.y &&
                currentBottom >= platform.y &&
                overlapsHorizontally
            ) {
                this.pos_y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
            }
        }
    }
}   