const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// nesta parte, criamos um objeto de imagem que pega a imagem do menu e do round
const menuImage = new Image();
const roundImage = new Image();
menuImage.src = "./assets/menu.png";
roundImage.src = "./assets/cenario.png";

let gameStatus = "menu";

menuImage.onload = function (){
    draw();
}

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

document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && gameStatus === "menu"){
        gameStatus = "playing";
        startGame();
    }
})

function startGame(){
    if (gameStatus == "playing"){
        ctx.drawImage(
            roundImage,
            0,
            0,
            canvas.width,
            canvas.height
        )
    }
}

