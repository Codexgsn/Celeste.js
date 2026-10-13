const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// nesta parte, criamos um objeto de imagem que pega a imagem do menu e do round
const menuImage = new Image();
const roundImage = new Image();
menuImage.src = "./assets/menu.png";
roundImage.src = "./assets/cenario.png";

// aqui é o status padrão sempre que iniciar o site (aparecendo o menu)
let gameStatus = "menu";

menuImage.onload = function (){
    draw();
}

// essa função desenha a imagem cobrindo todo o canvas
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStatus === "menu"){
        ctx.drawImage(
            menuImage,
            0,
            0,
            canvas.width,
            canvas.height
        )
    }
}

// comando para iniciar o jogo ao clicar enter
document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && gameStatus === "menu"){
        gameStatus = "playing";
        startGame();
    }
})

const player = new Player(ctx);

function gameLoop(){
    ctx.clearRect( 0, 0, canvas.width, canvas.height);

    if(roundImage.complete && roundImage.naturalWidth > 0){
        ctx.drawImage(
            roundImage,
            0,
            0,
            canvas.width,
            canvas.height
        )
    }

    player.drawPlayer();
    requestAnimationFrame(gameLoop);
}

// função que faz o jogo iniciar
function startGame(){
    if(gameStatus === "playing"){
        gameLoop();
    }
}