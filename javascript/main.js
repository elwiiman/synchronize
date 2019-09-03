let start = false;

//funcion para obtner el valor keycode del personaje "en el presente"
function getTimeAndKey(key, currentCharacter) {
  currentCharacter.instanceTimer.push(currentTime); // hace push en el arreglo de tiempos de la instancia del "presente"
  currentCharacter.instanceKeyPressed.push(key); // hace push en el arreglo de keycodes presionados, en la instancia del "presente"
}

function rutineForSetCharacterCopies(x, y) {
  //rutina que será llamada siempre que existan las condiciones para crear una copia
  getTimeAndKey("A", currentCharacter);
  stopClick(); //para el set interval
  resetClick(); // hace reset a la variable de tiempo "maestro"
  generateCharacter(x, y); //genera una nueva instancia de personaje la cual sera ahora el del "presente"
  characterCurrentInstance += 1; // aumenta en uno el indice para indicar cual es la actual instancia (instancia del "presente")
  currentCharacter = characterInstanceArr[characterCurrentInstance]; //asignacion del personaje actual
  characterInstanceArr[characterCurrentInstance - 1].isInPast = true; //indica que la instancia anterior ahora es "del Pasado"
  characterInstanceArr[characterCurrentInstance - 1].pastImagesAssign(); // corre el metodo que asigna las imagendes del personaje para representar los personajes del "pasado"
  for (i = 0; i <= characterInstanceArr.length - 2; i++) {
    characterInstanceArr[i].hasReturned = false;
  }
  startClick(); //inicia nuevamente la secuencia de tiempo
}

setTimeout(function() {
  drawCover();
}, 1);
//-----------------------------------------------
// let keys = []; // arreglo de todas las teclas presionadas

// let currentCharacter; //declaracion de la variable que tendra al personaje del "presente"
// let characterCurrentInstance = 0; // servira como indice para indicar cual es la instancia del "presente" en una arreglo de instancias de personajes
// generateCharacter(75, 470 - 35 - 125); // ejecuta la funcion para generar un personaje en las coordenadas indicadas
// currentCharacter = characterInstanceArr[characterCurrentInstance]; //indica cual es el personaje actual
// let background = new Background(0, 0, canvas.width, canvas.height);
// let ground = new Ground(-5, 470 - 35); // nueva instancia para el piso
// let door = new Door(50, 470 - 35 - 130);
// let plattform_1 = new Plattform(250, 470 - 18 - 50);
// let plattform_2 = new Plattform(610, 470 - 18 - 50);
// let obstacleDoor_1 = new ObstacleDoor(450, -25, 450);
// let obstacleDoor_2 = new ObstacleDoor(800, -25, 450);
// let diamond = new Diamond(870, 260);

// let plattformArr = [plattform_1, plattform_2];
// let obstacleDoorArr = [obstacleDoor_1, obstacleDoor_2];

let level = 0;
let maxLevels = 2;
document.onkeydown = function(e) {
  keys[e.keyCode] = true;

  if (keys[13] && start == false && level < maxLevels) {
    // tecla enter
    startClick();
    start = true;
    level = level + 1;
    levelSelector(level);

    // levelSelector(level);
    console.log("empieza el tiempo");
  }
  if (keys[65]) {
    // tecla A
    if (door.active && characterCurrentInstance == 0 && start == true) {
      rutineForSetCharacterCopies(door.x + 25, door.y + 5);
    } else if (
      door.active &&
      characterInstanceArr[characterCurrentInstance - 1].hasReturned == true &&
      diamond.hasBeenCollected == false &&
      start == true
    ) {
      rutineForSetCharacterCopies(door.x + 25, door.y + 5);
    } else if (
      door.active &&
      diamond.hasBeenCollected == true &&
      start == true
    ) {
      stopClick();
      resetClick();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      background.draw();
      ctx.drawImage(levelCompletedImage, 140, 0, 700, 300);
      diamond.hasBeenCollected = false;
      diamond.image = diamond.imageDiamond;
      start = false;
    }
  }

  if (keys[83] && start == true && level < maxLevels) {
    // tecla s
    levelSelector(level);
  }

  if (keys[40] || keys[37] || keys[38] || keys[39]) {
    // tecla down arrow
    e.preventDefault();
  }
};

document.onkeyup = function(e) {
  keys[e.keyCode] = false;
};
