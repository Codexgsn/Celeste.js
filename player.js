class Player{
    // aqui ficam as informações do jogador
    width = 50;
    height = 50;
    pos_x = 550;
    pos_y = 558;
    speed = 4;
    velocityY = 0;
    gravity = 0.6;
    jumpForce = 15;
    groundY = 558;
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
    updatePlayer(){

        if(this.keys["ArrowRight"]){
            this.pos_x += this.speed;
        }

        if(this.keys["ArrowLeft"]){
            this.pos_x -= this.speed;
        }

        if(this.keys["ArrowUp"] && this.pos_y == this.groundY){
            this.velocityY = -this.jumpForce
        }

        // aqui a gravidade é aplicada
        this.velocityY += this.gravity;
        this.pos_y += this.velocityY;

        if(this.pos_y >= this.groundY){
            this.pos_y = this.groundY;
        }
    }
}   