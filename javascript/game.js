//Global variables.

let keys = []; // arreglo de todas las teclas presionadas
let currentCharacter; //declaracion de la variable que tendra al personaje del "presente"
let characterCurrentInstance = 0; // servira como indice para indicar cual es la instancia del "presente" en una arreglo de instancias de personajes
let levelCompletedImage = new Image();
levelCompletedImage.src = levelCompleted;
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

function levelSelector(level) {
  switch (level) {
    case 2:
      break;
  }
}