function isWholeNumber(number) {
  // function to catch if a number is a whole number
  if (number % 1 == 0) return number;
  else return false;
}

function twoDigitsNumber(number) {
  if (number.toString().length < 2) {
    number = number.toString();
    let finalNumber = "0" + number;
    return finalNumber;
  } else {
    return number.toString();
  }
}

function publicTime(time) {
  if (time != false) timeLeft = gameOverTime - time;
  let digits = twoDigitsNumber(timeLeft);
  timeElapsedElement.innerText = "00:" + digits;
}

function publicLevel(level) {
  levelElement.innerText = "Level: " + level;
}

function drawCover() {
  ctx.drawImage(coverImage, 0, 0, canvas.width, canvas.height);
}
