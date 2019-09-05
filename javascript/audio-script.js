const mainSong = new Audio();
mainSong.src = "sounds/a-walk.mp3";

const achieveAudio = new Audio();
achieveAudio.src = "sounds/achieve.mp3";
achieveAudio.volume = 0.66;

const levelWin = new Audio();
levelWin.src = "sounds/winEdit.mp3";
levelWin.volume = 0.8;

const timeOverAudio = new Audio();
timeOverAudio.src = "sounds/timeOver.mp3";
timeOverAudio.volume = 0.8;

function rewindMainSong() {
  mainSong.currentTime = 44.5;
}

function rewind(audio) {
  audio.currentTime = 0;
}
