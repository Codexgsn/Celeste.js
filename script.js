const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// nesta parte, criamos um objeto de imagem que pega a imagem do menu
const menuImage = new Image();
menuImage.src = "./assets/menu-bg.png";

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