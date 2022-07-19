// CONTROL BUTTONS


const playButton = document.querySelector('.play');
const pauseButton = document.querySelector('.pause');
const setButton = document.querySelector('.set');
const stopButton = document.querySelector('.stop');
const addMinutes = document.querySelector('.add5');
const removeMinutes = document.querySelector('.remove5');
const TIMER = document.querySelector('#timer');
const lightModeButton = document.querySelector('.light-mode-btn');
const darkModeButton = document.querySelector('.dark-mode-btn');
const body = document.querySelector('body');

// circles
const forestVolumeButton = document.querySelector('.forest circle');
const rainVolumeButton = document.querySelector('.rain circle');
const coffeeshopVolumeButton = document.querySelector('.coffeeshop circle');
const fireplaceVolumeButton = document.querySelector('.fireplace circle');

//volume bars
const forestVolumeBar = document.querySelector('.forest rect');
const rainVolumeBar = document.querySelector('.rain rect');
const coffeeshopVolumeBar = document.querySelector('.coffeeshop rect');
const fireplaceVolumeBar = document.querySelector('.fireplace rect');

// circle positions
let forestVolCirclePos; // = forestVolumeButton.getAttribute('cx');
let rainVolCirclePos = rainVolumeButton.getAttribute('cx');
let coffeeshopVolCirclePos = coffeeshopVolumeButton.getAttribute('cx');
let fireplaceVolCirclePos = fireplaceVolumeButton.getAttribute('cx');

// volume based on circle position
let currentForestVolume;
let currentRainVolume;
let currentCoffeeshopVolume;
let currentFireplaceVolume;

// Logic controls
let minutesSet = document.querySelector('.minutes');
let currentMinutes = Number(minutesSet.textContent);
let userMinutes = 25;
let nextCounter = 5;

let seconds = document.querySelector('.seconds');
let currentSeconds = 0;

let lapsCounter = 0;

let soundIsPlaying = false;
let isClocking = false;
let isResting = false;

// SOUND BUTTONS
const forestButton = document.querySelector('.forest path');
const rainButton = document.querySelector('.rain path');
const coffeeshopButton = document.querySelector('.coffeeshop path');
const fireplaceButton = document.querySelector('.fireplace path');

// SOUNDS
const forestSound = new Audio('.https://drive.google.com/file/d/1CRHkV72WUMdcqec5GT_KdsqFz0z3VAOA/view'); // https://drive.google.com/file/d/1CRHkV72WUMdcqec5GT_KdsqFz0z3VAOA/view
const rainSound = new Audio('./sounds/chuva.wav'); // https://drive.google.com/file/d/1Ip8xBqAUJ-bty51Wz8JBtX_bWXCgA0P2/view
const coffeeshopSound = new Audio('./sounds/cafeteria.wav'); // https://drive.google.com/file/d/1OxLKpCwg2wrxXFNUHgZxJ51QEt0ac5RA/view
const fireplaceSound = new Audio('./sounds/lareira.wav'); // https://drive.google.com/file/d/1MakaBPxJvTa_whaSM3kEbRcxiVd1GRCB/view
const timeUpSound = new Audio('./sounds/kitchen-timer.mp3');

// PROMPT
const promptInput = document.querySelector('.input-wrapper input');
const promptButton = document.querySelector('.input-wrapper button');


// FUNCTIONS

// Sound functions

function playSound (sound) {
  soundIsPlaying = true;
  sound.play();
  sound.loop = true;
}


function stopThisSound (sound) {
  sound.pause();
  soundIsPlaying = false;
}

function soundButtonHandler(sound, button, volumeButton, volCirclePos, currentVolume) {
  if (soundIsPlaying) {
    stopThisSound(sound);
    button.classList.remove('selected-button');
    pos = 24;
    volumeBarHandler(sound, volumeButton, volCirclePos, currentVolume);
    return;
  }
  pos = 69;
  volumeBarHandler(sound, volumeButton, volCirclePos, currentVolume);
  playSound(sound);
  button.classList.add('selected-button');
}

function volumeHandler (sound, currentVolume) {
  sound.volume = currentVolume;
}

let pos;
let barPosition;
let mousePos;

function referenceGetter(bar) {
  barPosition = bar.getBoundingClientRect().x;
  return barPosition;
}


function mousePosGetter(e) {
  e = e || window.Event;
  mousePos = e.clientX;
  return mousePos;
}

function volumeBarHandler (sound, volumeButton, volCirclePos, currentVolume) {
  volumeButton.setAttribute('cx', pos);
  volCirclePos = volumeButton.getAttribute('cx');
  currentVolume = (volCirclePos - 24) * 1/90;
  volumeHandler(sound, currentVolume);
}


// Timer functions

function updateCounter (newMinutes, newSeconds) {
  let secondsDisplay = String(newSeconds).padStart(2,"0");
  seconds.textContent = secondsDisplay;
  currentSeconds = newSeconds;

  let minutesDisplay = String(newMinutes).padStart(2, '0');
  minutesSet.textContent = minutesDisplay;
  currentMinutes = newMinutes;
}

function countdown() {
  pomoTimer = setTimeout(function () {
    isClocking = true;

    newSeconds = Number(seconds.textContent) - 1;
    newMinutes = Number(minutesSet.textContent);

    if (newSeconds < 0) {
      newSeconds = 59;
      newMinutes = newMinutes - 1;
    }

    updateCounter(newMinutes, newSeconds);

    isFinished = newSeconds === 0 && newMinutes === 0;

    if (isFinished) {
      timeUpSound.play();
      if (isResting) {
        isResting = false;
        nextCounter = userMinutes;
        showMessage('Vamos lá! De volta ao foco!', 8000)
      } else {
        increaseScore();
        isResting = true;
        lapsCounter++;
        if (lapsCounter >= 4) {
          showMessage('Hora de dar uma pausa mais longa!', 8000)
          nextCounter = 30;
          lapsCounter = 0;
        } else {
        nextCounter = 5;
        }
      }
      timeUp();
      return;
    }

    countdown();
    
  }, 1000)
}

function pause() {
  clearTimeout(pomoTimer);
  isClocking = false;
}

function resetControls() {
  pauseButton.classList.add('hidden');
  playButton.classList.remove('hidden');
  stopButton.classList.add('hidden');
  setButton.classList.remove('hidden');
}

function timeUp() {
  clearTimeout(pomoTimer);
  updateCounter(00, 00);
  TIMER.classList.add('time-up');
  
  const delay = setTimeout(() => {
    updateCounter(nextCounter, 00);
  }, 1500);

  resetControls();
  isClocking = false;
}

function stopNow() {
  clearTimeout(pomoTimer);
  updateCounter(userMinutes, 00);
  resetControls();
  isClocking = false;
}

// Message functions
const message = document.querySelector('.message');

function showMessage(messageDisplay, displayTime) {
  document.querySelector('.message').textContent = messageDisplay;
  message.classList.add('show');
  message.classList.remove('hide');
  setTimeout(function () {
    message.classList.add('hide');
    message.classList.remove('show');
  }, displayTime)
}

// Prompt functions

function getMinutes() {
  userMinutes = Number(document.querySelector('#user-minutes').value);
  if (userMinutes != currentMinutes && userMinutes) {
    currentMinutes = userMinutes;
  }
  updateCounter(currentMinutes, 00);
  message.classList.add('hide');
  message.classList.remove('show');
  promptInput.classList.add('hidden');
  promptButton.classList.add('hidden'); 
}


// Score functions
let pomodores = document.querySelector('.pomodores');
let scoreDisplay = document.querySelector('.pomodores').textContent;
let scores = Number(scoreDisplay);

function increaseScore() {
  scores++;
  scoreDisplay = String(scores).padStart(3,'0');
  document.querySelector('.pomodores').textContent = scoreDisplay;
  showMessage(`Parabéns! Você plantou um tomate!\nDescanse um pouco!`, 8000)
  pomodores.classList.add('update');
  setTimeout (() => {
    pomodores.classList.remove('update');
  }, 1500)
}



// mode functions

function toggleTheme () {
  lightModeButton.classList.toggle('hidden');
  darkModeButton.classList.toggle('hidden');
  body.classList.toggle('light-theme');
  body.classList.toggle('dark-theme');
}

// events

playButton.addEventListener('click', function () {
  playButton.classList.add('hidden');
  pauseButton.classList.remove('hidden');
  setButton.classList.add('hidden');
  stopButton.classList.remove('hidden');
  TIMER.classList.remove('time-up');

  countdown();
})

pauseButton.addEventListener('click', function () {
  playButton.classList.remove('hidden');
  pauseButton.classList.add('hidden');
  pause();
})

stopButton.addEventListener('click', function () {
  stopNow();
})

setButton.addEventListener('click', function () {
  // userMinutes = Number(prompt('Quantos minutos de foco?'));
  // getMinutes();
  showMessage('Quantos minutos de foco?', 99999999);
  promptInput.classList.remove('hidden');
  promptButton.classList.remove('hidden');
})



addMinutes.addEventListener('click', function () {
  updateCounter(currentMinutes + 5, currentSeconds);
})

removeMinutes.addEventListener('click', function () {
  if (currentMinutes >= 5) {
    updateCounter(currentMinutes - 5, currentSeconds);
  } else {
    stopNow();
  }

  if (currentMinutes === 0 && currentSeconds === 0) {
    updateCounter(userMinutes, 00);
  }
})

forestButton.addEventListener('click', function () {
  soundButtonHandler(forestSound, forestButton, forestVolumeButton, forestVolCirclePos, currentForestVolume);
})

coffeeshopButton.addEventListener('click', function () {
  soundButtonHandler(coffeeshopSound, coffeeshopButton, coffeeshopVolumeButton, coffeeshopVolCirclePos, currentCoffeeshopVolume);
})

fireplaceButton.addEventListener('click', function() {
  soundButtonHandler(fireplaceSound, fireplaceButton, fireplaceVolumeButton, fireplaceVolCirclePos, currentFireplaceVolume);
})

rainButton.addEventListener('click', function () {
  soundButtonHandler(rainSound, rainButton, rainVolumeButton, rainVolCirclePos, currentRainVolume);
});

lightModeButton.addEventListener('click', function() {
  toggleTheme();
})

darkModeButton.addEventListener('click', function () {
  toggleTheme();
})

forestVolumeBar.addEventListener('mouseup', function (e) {
  e = e || window.Event;
  referenceGetter(forestVolumeBar);
  mousePosGetter(e);
  pos = mousePos - barPosition + 24;
  volumeBarHandler(forestSound, forestVolumeButton, forestVolCirclePos, currentForestVolume);
})

rainVolumeBar.addEventListener('mouseup', function (e) {
  e = e || window.Event;
  referenceGetter(rainVolumeBar);
  mousePosGetter(e);
  pos = mousePos - barPosition + 24;
  volumeBarHandler(rainSound, rainVolumeButton, rainVolCirclePos, currentRainVolume);
})

coffeeshopVolumeBar.addEventListener('mouseup', function (e) {
  e = e || window.Event;
  referenceGetter(coffeeshopVolumeBar);
  mousePosGetter(e);
  pos = mousePos - barPosition + 24;
  volumeBarHandler(coffeeshopSound, coffeeshopVolumeButton, coffeeshopVolCirclePos, currentCoffeeshopVolume);
})

fireplaceVolumeBar.addEventListener('mouseup', function (e) {
  e = e || window.Event;
  referenceGetter(fireplaceVolumeBar);
  mousePosGetter(e);
  pos = mousePos - barPosition + 24;
  volumeBarHandler(fireplaceSound, fireplaceVolumeButton, fireplaceVolCirclePos, currentFireplaceVolume);
})
