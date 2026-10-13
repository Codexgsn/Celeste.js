class Player{
    constructor(ctx){
        this.ctx = ctx;
        this.width = 50;
        this.height = 50;
        this.pos_x = 100;
        this.pos_y = 100;
        this.speed = 5;
        this.velocityY = 0;
        this.gravity = 0.6;
        this.jumpForce = 12;
    };

    drawPlayer(){
        this.ctx.fillStyle = "red";

        this.ctx.fillRect(
            this.pos_x,
            this.pos_y,
            this.width,
            this.height
        )
    };
}