//Global variables.

let keys = []; // arreglo de todas las teclas presionadas
let currentCharacter; //declaracion de la variable que tendra al personaje del "presente"
let characterCurrentInstance = 0; // servira como indice para indicar cual es la instancia del "presente" en una arreglo de instancias de personajes
let background = new Background(0, 0, canvas.width, canvas.height);
let ground = new Ground(-5, 470 - 35); // nueva instancia para el piso
let door = new Door(50, 470 - 35 - 130);
generateCharacter(door.x + 25, door.y + 5); // ejecuta la funcion para generar un personaje en las coordenadas indicadas
currentCharacter = characterInstanceArr[characterCurrentInstance]; //indica cual es el personaje actual
let plattform_1 = new Plattform(250, 470 - 18 - 50);
let plattform_2 = new Plattform(610, 470 - 18 - 50);
let obstacleDoor_1 = new ObstacleDoor(450, -25, 450);
let obstacleDoor_2 = new ObstacleDoor(800, -25, 450);
let diamond = new Diamond(870, 260);
let plattformArr = [plattform_1, plattform_2];
let obstacleDoorArr = [obstacleDoor_1, obstacleDoor_2];
let gameOverTime = 12;
let timeLeft = 12;
let isGameOver = false;

function levelSelector(level) {
  switch (level) {
    case 1:
      stopClick();
      resetClick();
      door.x = 50;
      door.y = 470 - 35 - 130;
      characterInstanceArr = [];
      generateCharacter(door.x + 25, door.y + 5);
      characterCurrentInstance = 0;
      currentCharacter = characterInstanceArr[characterCurrentInstance];
      background.x = 0;
      background.y = 0;
      background.width = canvas.width;
      background.height = canvas.height;
      ground.x = -5;
      ground.y = 470 - 35;
      plattform_1.x = 250;
      plattform_1.y = 470 - 18 - 50;
      plattform_2.x = 610;
      plattform_2.y = 470 - 18 - 50;
      obstacleDoor_1.x = 450;
      obstacleDoor_1.y = -25;
      obstacleDoor_1.height = 450;
      obstacleDoor_2.x = 800;
      obstacleDoor_2.y = -25;
      obstacleDoor_2.height = 450;
      diamond.x = 870;
      diamond.y = 260;
      if (diamond.hasBeenCollected == true) {
        diamond.hasBeenCollected = false;
        diamond.image = diamond.imageDiamond;
      }
      plattformArr = [plattform_1, plattform_2];
      obstacleDoorArr = [obstacleDoor_1, obstacleDoor_2];
      gameOverTime = 12;
      timeLeft = 12;
      isGameOver = false;

      setTimeout(function() {
        startClick();
        console.log("YAA");
      }, 100);

      break;
    case 2:
      stopClick();
      resetClick();
      console.log("nivel 2 iniciado");
      door.x = 50;
      door.y = 470 - 35 - 130;
      characterInstanceArr = [];
      generateCharacter(door.x + 25, door.y + 5);
      characterCurrentInstance = 0;
      currentCharacter = characterInstanceArr[characterCurrentInstance];
      background.x = 0;
      background.y = 0;
      background.width = canvas.width;
      background.height = canvas.height;
      ground.x = -5;
      ground.y = 470 - 35;
      plattform_1.x = 400;
      plattform_1.y = 470 - 18 - 50;
      if (diamond.hasBeenCollected == true) {
        diamond.hasBeenCollected = false;
        diamond.image = diamond.imageDiamond;
      }
      plattformArr = [plattform_1];
      obstacleDoorArr = [];
      gameOverTime = 10;
      timeLeft = 10;

      setTimeout(function() {
        startClick();
        console.log("YAA");
      }, 100);
      break;
  }
}
