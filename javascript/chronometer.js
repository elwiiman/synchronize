function checkGameOver() {
  if (timeLeft == 0) {
    isGameOver = true;
  } else {
    isGameOver = false;
  }
}

function gameOver() {
  stopClick();
  resetClick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  ctx.drawImage(timeOverImage, 250, 20, 480, 230);
  mainSong.pause();
  timeOverAudio.play();
  console.log("here");
  rewindMainSong();
}

//-------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let characterInstanceArr = []; // arreglo de instancias de personajes
let currentTime = 0; // tiempo "maestro" inicializado
let intervalId; // declaracion de un interval ID global
let friction = 0.55;
let yFriction = 0.49;
const timeConstant = 35;
let realCurrentTime;
let timeToShow;
let timeElapsedElement = document.getElementById("time-span");
let levelElement = document.getElementById("level-span");

//seccion para cargar imagenes
const cover = "images/cover/cover.png";

const levelCompleted = "images/levelcompleted/levelCompleted.png";

const timeOver = "images/levelcompleted/timeOver.png";

const backgroundImage = {
  night: "images/background/backgroundCity.jpg",
  light: "images/background/backgroundCityLight.jpg",
  future: "images/background/backgroundFuture.jpg"
};
const groundImage = "images/ground.png";

const diamondImage = {
  colorDiamond: "images/diamond/diamond.png",
  transparentDiamond: "images/diamond/diamondTransparent.png"
};

const doorImage = {
  activeDoor: "images/door/activeDoor.png",
  inactiveDoor: "images/door/inactiveDoor.png"
};

const obstacleDoorImage = {
  obstacleDoorBig: "images/obstacleDoor/obstacleDoor-Big.png",
  obstacleDoorSmall: "images/obstacleDoor/obstacleDoor-Small.png"
};

const plattformImages = {
  plattformBase: "images/plattform/plattformBase.png",
  plattformTop: "images/plattform/plattformTop.png",
  plattform: "images/plattform/plattform.png"
};

const characterImages = {
  frontman: "images/color/frontman.png",
  right: "images/color/manright.png",
  left: "images/color/manleft.png",
  rightWalk: "images/color/manWalkRight.png",
  leftWalk: "images/color/manWalkLeft.png",
  transparentMan: "images/color/transparentMan.png"
};

const characterGrayImages = {
  frontman: "images/gray/frontman.png",
  right: "images/gray/manright.png",
  left: "images/gray/manleft.png",
  rightWalk: "images/gray/manWalkRight.png",
  leftWalk: "images/gray/manWalkLeft.png",
  transparentMan: "images/gray/transparentMan.png"
};

let coverImage = new Image();
coverImage.src = cover;
let levelCompletedImage = new Image();
levelCompletedImage.src = levelCompleted;
let timeOverImage = new Image();
timeOverImage.src = timeOver;

// classes definition section
class Background {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = backgroundImage.night;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Diamond {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 35;
    this.yMin = y;
    this.yMax = y + 8;
    this.imageDiamond = new Image();
    this.imageDiamond.src = diamondImage.colorDiamond;
    this.imageTransparentDiamond = new Image();
    this.imageTransparentDiamond.src = diamondImage.transparentDiamond;
    this.image = new Image();
    this.image = this.imageDiamond;
    this.limitTop = true;
    this.limitDown = false;
    this.hasBeenCollected = false;
  }

  draw() {
    if (this.hasBeenCollected == false) {
      if (this.limitTop == true) this.y += 0.2;
      if (this.y > this.yMax) {
        this.limitDown = true;
        this.limitTop = false;
      }

      if (this.limitDown == true) this.y -= 0.2;
      if (this.y < this.yMin) {
        this.limitDown = false;
        this.limitTop = true;
      }

      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  clear() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

class Ground {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = groundImage;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class ObstacleDoor {
  constructor(x, y, height, id) {
    this.x = x;
    this.y = y;
    this.yMin = -360;
    this.yMax = y;
    this.width = 40;
    this.height = height;
    this.image = new Image();
    this.image.src = obstacleDoorImage.obstacleDoorBig;
    this.id = id;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Door {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 140;
    this.imageInactive = new Image();
    this.imageInactive.src = doorImage.inactiveDoor;
    this.imageActive = new Image();
    this.imageActive.src = doorImage.activeDoor;
    this.image = new Image();
    this.image = this.imageInactive;
    this.active = false;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 53;
    this.height = 125;
    this.intervalId;
    this.instanceTimer = []; // arreglo que guarda los tiempos en los que las teclas de comando son oprimidas
    this.instanceKeyPressed = []; // arreglo que guarda qué teclas fueron oprimidas
    this.imageTransparent = new Image();
    this.imageTransparent.src = characterImages.transparentMan;
    this.imageFrontman = new Image();
    this.imageFrontman.src = characterImages.frontman;
    this.imageLeft = new Image();
    this.imageLeft.src = characterImages.left;
    this.imageRight = new Image();
    this.imageRight.src = characterImages.right;
    this.imageWalkLeft = new Image();
    this.imageWalkLeft.src = characterImages.leftWalk;
    this.imageWalkRight = new Image();
    this.imageWalkRight.src = characterImages.rightWalk;
    this.image = this.imageFrontman;
    this.isInPast = false; // bandera para indicar si el personaje está en el pasado
    this.isJumping = false; // bandera para indicar si el personaje esta saltando
    this.isGrounded = false; // bandera para indicar si el personaje está en el piso
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.isCollidedRight = false;
    this.isCollidedLeft = false;
    this.isCollidedTop = false;
    this.isCollidedBottom = false;
    this.isCollidedWithPlattform = false;
    this.hasReturned = false;
    this.jumpAudio = new Audio();
    this.jumpAudio.src = "sounds/jumpSound.mp3";
    this.jumpAudio.volume = 0.2;
  }
  overlapCheck(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  colChecker(shapeB) {
    // metodo para verificar colisiones entre personaje y objetos del entorno en general
    // get the vectors to check against
    let vX = this.x + this.width / 2 - (shapeB.x + shapeB.width / 2),
      vY = this.y + this.height / 2 - (shapeB.y + shapeB.height / 2),
      // add the half widths and half heights of the objects
      hWidths = this.width / 2 + shapeB.width / 2,
      hHeights = this.height / 2 + shapeB.height / 2,
      colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      let oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          // this.y += oY + 10;
          // this.yVelocity = 10;
          // this.fall();
        } else {
          colDir = "b";
          this.y -= oY + 10;
          this.isJumping = false;
          this.isGrounded = true;
          // rewind(jumpAudio);
          // jumpAudio.pause();
        }
      } else {
        if (vX > 0) {
          colDir = "r";
          this.x += oX;
          this.xVelocity = 0;
        } else {
          this.xVelocity = 0;
          colDir = "l";
          this.x -= oX;
        }
      }
    }
    return colDir;
  }

  colCheckerPlattforms(shapeB) {
    //metodo para verificar colisiones entre personaje y plataformas
    // get the vectors to check against
    let vX = this.x + this.width / 2 - (shapeB.x + shapeB.width / 2),
      vY = this.y + this.height / 2 - (shapeB.y + shapeB.height / 2),
      // add the half widths and half heights of the objects
      hWidths = this.width / 2 + shapeB.width / 2,
      hHeights = this.height / 2 + shapeB.height / 2;
    let colDir;
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      let oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          // colDir = "t"; // colision en top
          // this.y += oY;
          // this.yVelocity *= -1;
        } else {
          colDir = "b"; // colisione en bottom
          this.y -= oY + 10;
          this.isJumping = false;
          this.isGrounded = true;
          shapeB.isCollided = true;
          // rewind(jumpAudio);
          // jumpAudio.pause();
        }
      } else {
        if (vX > 0) {
          colDir = "r"; // colisione en right
          this.x += oX;
          this.xVelocity = 0;
        } else {
          colDir = "l"; // colision en left
          this.x -= oX;
          this.xVelocity = 0;
        }
      }
    }
    if (colDir != "b") {
      shapeB.isCollided = false;
    }
    return colDir;
  }

  moveLeft() {
    this.xVelocity -= 3.5;
    this.image = this.imageLeft;
    this.animationLeft();
  }

  moveRight() {
    this.xVelocity += 3.5;
    this.image = this.imageRight;
    this.animationRight();
  }

  jump() {
    this.jumpAudio.play();
    this.isJumping = true;
    this.yVelocity -= 90;
  }

  animationRight() {
    if (currentTime % 4 === 0) {
      this.image =
        this.image === this.imageRight ? this.imageWalkRight : this.imageRight;
    }
  }

  animationLeft() {
    if (currentTime % 4 === 0) {
      this.image =
        this.image === this.imageLeft ? this.imageWalkLeft : this.imageLeft;
    }
  }

  animationJumpLeft() {
    this.image = this.imageWalkLeft;
  }

  animationJumpRight() {
    this.image = this.imageWalkRight;
  }

  pastImagesAssign() {
    // metodo que asigna imagenes con color degradado para distinguir entre pasado y presente
    this.imageFrontman.src = characterGrayImages.frontman;
    this.imageLeft.src = characterGrayImages.left;
    this.imageRight.src = characterGrayImages.right;
    this.imageWalkLeft.src = characterGrayImages.leftWalk;
    this.imageWalkRight.src = characterGrayImages.rightWalk;
    this.imageTransparent.src = characterGrayImages.transparentMan;
    this.image = this.imageFrontman;
  }

  fall() {
    this.yVelocity += 9.8; // effect of gravity
  }
}

class Plattform {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.width = 85;
    this.height = 18;
    this.maxY = y;
    this.minY = y - 20;
    this.imagePlattformTop = new Image();
    this.imagePlattformTop.src = plattformImages.plattformTop;
    this.active = false;
    this.action = false;
    this.isCollided = false;
    this.id = id;
  }

  colChecker(shapeB) {
    //metodo para verificar colisiones entre personaje y plataformas
    // get the vectors to check against
    let vX = this.x + this.width / 2 - (shapeB.x + shapeB.width / 2),
      vY = this.y + this.height / 2 - (shapeB.y + shapeB.height / 2),
      // add the half widths and half heights of the objects
      hWidths = this.width / 2 + shapeB.width / 2,
      hHeights = this.height / 2 + shapeB.height / 2;
    let colDir;
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      let oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t"; // colision en top
        } else {
          colDir = "b"; // colisione en bottom
        }
      }
    }
    return colDir;
  }

  draw() {
    //metodo de dibujo de la clase de plataformas
    ctx.drawImage(
      this.imagePlattformTop,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function evalOverlapDiamond() {
  if (currentCharacter.overlapCheck(diamond)) {
    diamond.image = diamond.imageTransparentDiamond;
    diamond.hasBeenCollected = true;
    achieveAudio.play();
  }
}

function evalOverlapDoor() {
  if (characterCurrentInstance == 0) {
    if (currentCharacter.overlapCheck(door)) {
      door.active = true;
      door.image = door.imageActive;
    } else {
      door.active = false;
      door.image = door.imageInactive;
    }
  } else {
    if (
      currentCharacter.overlapCheck(door) &&
      characterInstanceArr[characterCurrentInstance - 1].hasReturned == true
    ) {
      door.active = true;
      door.image = door.imageActive;
    } else {
      door.active = false;
      door.image = door.imageInactive;
    }
  }
}

function drawGrounds() {
  groundArr.forEach(ground => {
    ground.draw();
  });
}

function drawPlattforms() {
  plattformArr.forEach(plattformElement => {
    if (plattformElement.active == true) {
      if (plattformElement.y < plattformElement.maxY) {
        plattformElement.y += 4; //aumenta posicion en y hasta maxY
      }
    } else {
      if (plattformElement.y > plattformElement.minY) {
        plattformElement.y -= 4; //disminuye posicion en y hasta maxY
      }
    }
    plattformElement.draw();
  });
}

function drawObstacleDoors() {
  for (let i = 0; i < obstacleDoorArr.length; i++) {
    for (let j = 0; j < plattformArr.length; j++) {
      if (obstacleDoorArr[i].id == plattformArr[j].id) {
        if (plattformArr[j].active == true) {
          if (obstacleDoorArr[i].y > obstacleDoorArr[i].yMin)
            obstacleDoorArr[i].y -= 5;
        } else {
          if (obstacleDoorArr[i].y <= obstacleDoorArr[i].yMax)
            obstacleDoorArr[i].y += 20;
        }
      }
    }
    obstacleDoorArr[i].draw();
  }
}

function characterWithPlattformColliderCheck(plattformArr, characterArr) {
  let colChecker;
  for (let i = 0; i < characterArr.length; i++) {
    for (let j = 0; j < plattformArr.length; j++) {
      colChecker = characterArr[i].colCheckerPlattforms(plattformArr[j]);
      if (colChecker == "b") {
        rewind(characterArr[i].jumpAudio);
        characterArr[i].jumpAudio.pause();
      }
    }
  }
}

function characterWithObstacleDoorColliderCheck(obstacleDoorArr, characterArr) {
  for (let i = 0; i < characterArr.length; i++) {
    for (let j = 0; j < obstacleDoorArr.length; j++) {
      characterArr[i].colChecker(obstacleDoorArr[j]);
    }
  }
}

function characterWithGroundColliderCheck(groundArr, characterArr) {
  let colChecker;
  for (let i = 0; i < characterArr.length; i++) {
    for (let j = 0; j < groundArr.length; j++) {
      colChecker = characterArr[i].colChecker(groundArr[j]);
      if (colChecker == "b") {
        rewind(characterArr[i].jumpAudio);
        characterArr[i].jumpAudio.pause();
      }
    }
  }
}

function plattformWithCharacterColliderCheck(plattformArr, characterArray) {
  let colDirWithCharacter;
  salta: for (let j = 0; j < plattformArr.length; j++) {
    // recorre todas las plataformas
    for (let i = 0; i < characterArray.length; i++) {
      // recorre todos los personajes
      colDirWithCharacter = plattformArr[j].colChecker(characterArray[i]); //obtiene el lugar de colision de una plataforma con un personaje
      if (colDirWithCharacter === "t") {
        plattformArr[j].active = true;
        continue salta;
      } else {
        plattformArr[j].active = false;
      }
    }
  }
}

function drawPresent() {
  currentCharacter.fall(); //aplica gravedad
  ctx.drawImage(
    // dibuja la imagen del current character (personaje del presente) o instancia más actual
    currentCharacter.image,
    (currentCharacter.x += currentCharacter.xVelocity),
    (currentCharacter.y += currentCharacter.yVelocity),
    currentCharacter.width,
    currentCharacter.height
  );
  currentCharacter.xVelocity *= friction;
  currentCharacter.yVelocity *= yFriction;
}

// getMinutes() {
//   let minutes = 0;
//   minutes = Math.floor(this.currentTime / 60);
//   return minutes;
// }
// getSeconds() {
//   let seconds = 0;
//   seconds = this.currentTime % 60;
//   return seconds;
// }

function stopClick() {
  console.log("stop", intervalId);
  clearInterval(intervalId);
}

function resetClick() {
  currentTime = 0;
}

function splitClick() {
  return this.currentTime;
}

function startClick() {
  intervalId = setInterval(() => {
    currentTime += 1; //aumenta en 1 el tiempo maestro
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    controllerCheck(); //ejecuta los comandos de movimiento de acuerdo a las teclas presionadas
    background.draw();
    drawGrounds(); // dibuja el piso
    door.draw();
    diamond.draw();
    characterWithGroundColliderCheck(groundArr, characterInstanceArr);
    plattformWithCharacterColliderCheck(plattformArr, characterInstanceArr);
    characterWithPlattformColliderCheck(plattformArr, characterInstanceArr); // revisa colisiones entre plataformas y personajes
    drawPlattforms(); // dibuja las plataformas
    characterWithObstacleDoorColliderCheck(
      obstacleDoorArr,
      characterInstanceArr
    );
    drawObstacleDoors();
    replay(); // ejecuta la funcion para las replicas
    drawPresent(); // dibuja el "presente"
    evalOverlapDoor();
    evalOverlapDiamond();
    // console.log(diamond.hasBeenCollected);

    //calculus of elapsed time
    realCurrentTime = currentTime / timeConstant;
    timeToShow = isWholeNumber(realCurrentTime);
    publicTime(timeToShow);
    publicLevel(level);
    checkGameOver();
    if (isGameOver) {
      gameOver();
    }
  }, 1000 / 35);
}

function generateCharacter(x, y) {
  character = new Character(x, y);
  characterInstanceArr.push(character);
}

function replay() {
  //funcion para dibujar a las replicas
  if (characterInstanceArr.length > 1) {
    //ejecuta hasta que haya mas de una instancia de personajes
    for (let i = 0; i <= characterInstanceArr.length - 2; i++) {
      // para todas las instancias menos la del presente (menos la màs nueva)
      characterInstanceArr[i].fall(); //aplica gravedad a las replicas
      ctx.drawImage(
        // dibuja a las replicas
        characterInstanceArr[i].image,
        (characterInstanceArr[i].x += characterInstanceArr[i].xVelocity),
        (characterInstanceArr[i].y += characterInstanceArr[i].yVelocity),
        characterInstanceArr[i].width,
        characterInstanceArr[i].height
      );
      characterInstanceArr[i].xVelocity *= friction;
      characterInstanceArr[i].yVelocity *= yFriction;
      for (let j = 0; j < characterInstanceArr[i].instanceTimer.length; j++) {
        //recorre los tiempos del arrelgo instanceTimer de cada instancia del pasado
        if (currentTime == characterInstanceArr[i].instanceTimer[j])
          // si un valor del tiempo "master" es igual a un tiempo de los almacenados en el arreglo instanceTimer
          // console.log("Time equal!!");
          switch (
            characterInstanceArr[i].instanceKeyPressed[j] //ejecuta los comandos de movimeinto
          ) {
            case "Left":
              if (characterInstanceArr[i].x > 0)
                characterInstanceArr[i].moveLeft();
              break;
            case "Right":
              if (
                characterInstanceArr[i].x + characterInstanceArr[i].width <
                canvas.width
              )
                characterInstanceArr[i].moveRight();
              break;
            case "Up":
              if (characterInstanceArr[i].isJumping !== true) {
                characterInstanceArr[i].jump();
                characterInstanceArr[i].isGrounded = false;
              }
              break;
            case "jumpLeft":
              characterInstanceArr[i].animationJumpLeft();
              break;
            case "jumpRight":
              characterInstanceArr[i].animationJumpRight();
              break;
            case "A":
              characterInstanceArr[i].image =
                characterInstanceArr[i].imageTransparent;
              characterInstanceArr[i].hasReturned = true;
              break;
          }
      }
    }
  }
}
