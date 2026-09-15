// Pantalla de carga
let progress = 0;
const fill = document.getElementById('loading-fill');
const loadingText = document.getElementById('loading-text');

const interval = setInterval(() => {
  progress += Math.random() * 15;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(showMenu, 400);
  }
  fill.style.width = progress + '%';
  loadingText.textContent = 'Cargando... ' + Math.floor(progress) + '%';
}, 150);

function showMenu() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
  document.getElementById('money-counter').classList.remove('hidden');
  showNotification('🎮 Bienvenido a Los Santos', '💛');
}

// ===== FONDO QUE CAMBIA CADA 10s =====
const backgrounds = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80',
  'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80'
];

const menuBg = document.querySelector('.menu-bg');
let bgIndex = 0;

function changeBackground() {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  menuBg.style.opacity = '0';
  setTimeout(() => {
    menuBg.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url('${backgrounds[bgIndex]}')`;
    menuBg.style.opacity = '1';
  }, 2000);
}

setInterval(changeBackground, 10000);

// ===== CONTADOR DE DINERO =====
let money = 0;
const moneyAmount = document.getElementById('money-amount');

function addMoney(amount) {
  money += amount;
  moneyAmount.textContent = '$' + money;
  showNotification('💰 +$' + amount + ' conseguido');
}

// ===== NOTIFICACIÓN ESTILO GTA =====
const notif = document.getElementById('gta-notification');
const notifIcon = document.getElementById('notif-icon');
const notifText = document.getElementById('notif-text');
let notifTimer = null;

function showNotification(message, icon = '🔔') {
  notifIcon.textContent = icon;
  notifText.textContent = message;
  notif.classList.remove('hidden');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => notif.classList.add('hidden'), 3000);
}

// ===== SONIDOS =====
let audioCtx = null;

function playHover() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = 600;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

function playSelect() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = 900;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {}
}

// ===== RADIO GTA =====
let radioOn = false;
let radioAudio = null;

document.getElementById('radio-btn').addEventListener('click', () => {
  playSelect();
  radioOn = !radioOn;
  const btn = document.getElementById('radio-btn');

  if (radioOn) {
    btn.classList.add('on');
    btn.textContent = '📻 RADIO GTA: ON';
    showNotification('📻 Radio GTA encendida', '🎵');

    // PON AQUÍ TU ENLACE DE MP3 (cambia el texto entre comillas):
    const songUrl = '';

    if (songUrl) {
      radioAudio = new Audio(songUrl);
      radioAudio.loop = true;
      radioAudio.volume = 0.6;
      radioAudio.play();
    } else {
      // Si no hay canción, suena una melodía generada tipo radio
      playRadioTune();
    }
  } else {
    btn.classList.remove('on');
    btn.textContent = '📻 RADIO GTA';
    showNotification('📻 Radio GTA apagada', '🔇');
    if (radioAudio) { radioAudio.pause(); radioAudio = null; }
    stopRadioTune();
  }
});

// Melodía generada tipo radio (suena si no hay MP3)
let radioTuneInterval = null;

function playRadioTune() {
  const notes = [440, 493, 523, 587, 659, 698, 784, 880];
  let n = 0;
  radioTuneInterval = setInterval(() => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = notes[n % notes.length];
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
      n++;
    } catch (e) {}
  }, 300);
}

function stopRadioTune() {
  clearInterval(radioTuneInterval);
}

// Navegación del menú
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('mouseenter', playHover);
  btn.addEventListener('click', () => {
    playSelect();
    const target = btn.getAttribute('data-target');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById(target).classList.remove('hidden');
    window.scrollTo(0, 0);
    if (target === 'carreras') startRace();
  });
});

// Botones de volver (incluye cerrar mapa, video y personaje)
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('mouseenter', playHover);
  btn.addEventListener('click', () => {
    playSelect();
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById('mapa-overlay').classList.add('hidden');
    document.getElementById('video-player').classList.add('hidden');
    document.getElementById('char-overlay').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    stopRace();
  });
});

// ===== VENTANA DE PERSONAJE =====
const characters = {
  juan: {
    name: 'JUAN',
    photo: 'foto-juan.jpg',
    personality: 'Amoroso, fantástico, maravilloso, chill, paciente, celoso, detallista.',
    physical: 'Chico de aprox 1,70, medio blanco quemado por el sol. Pelo castaño no tan oscuro y liso, ojos color marrón osito, lunar en el labio + otros cerca de la nariz y boca que hacen un cuadrado, QK en la ceja, labios prominentes, cuerpo delicioso.'
  },
  aneth: {
    name: 'ANETH',
    photo: 'foto-aneth.jpg',
    personality: 'Enojona, risueña, celosa, detallista, amorosa, poca paciencia.',
    physical: 'Chica de 1.50, blanquita, pelo castaño oscuro rizado.'
  }
};

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', () => {
    playSelect();
    const key = card.getAttribute('data-char');
    const data = characters[key];
    document.getElementById('char-name').textContent = data.name;
    document.getElementById('char-photo-img').src = data.photo;
    document.getElementById('char-personality').textContent = 'Personalidad: ' + data.personality;
    document.getElementById('char-physical').textContent = 'Físico: ' + data.physical;
    document.getElementById('char-overlay').classList.remove('hidden');
  });
});

// ===== MAPA =====
document.getElementById('open-map').addEventListener('click', () => {
  playSelect();
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('mapa-overlay').classList.remove('hidden');
});

// Puntos del mapa: mostrar nombre
document.querySelectorAll('.map-point').forEach(point => {
  point.addEventListener('mouseenter', () => {
    const label = document.getElementById('map-label');
    label.textContent = point.getAttribute('data-name');
    label.classList.add('show');
  });
  point.addEventListener('mouseleave', () => {
    document.getElementById('map-label').classList.remove('show');
  });
  point.addEventListener('click', () => {
    const label = document.getElementById('map-label');
    label.textContent = point.getAttribute('data-name');
    label.classList.add('show');
    setTimeout(() => label.classList.remove('show'), 2000);
  });
});

// ===== GALERÍA: reproducir video =====
document.querySelectorAll('.gallery-item.video').forEach(item => {
  item.addEventListener('click', () => {
    playSelect();
    const video = document.getElementById('video-element');
    video.src = item.getAttribute('data-video');
    document.getElementById('video-player').classList.remove('hidden');
    video.play();
  });
});

document.getElementById('close-video').addEventListener('click', () => {
  const video = document.getElementById('video-element');
  video.pause();
  video.src = '';
  document.getElementById('video-player').classList.add('hidden');
});

// ===== MINI-JUEGO DE CARRERAS =====
const raceArea = document.querySelector('.race-area');
const raceCar = document.getElementById('race-car');
const raceScoreEl = document.getElementById('race-score');
let raceScore = 0;
let raceRunning = false;
let raceObstacles = [];
let obstacleInterval = null;

function startRace() {
  raceRunning = true;
  raceScore = 0;
  raceScoreEl.textContent = '0';
  raceObstacles.forEach(o => o.remove());
  raceObstacles = [];
  raceCar.style.left = '50%';
  obstacleInterval = setInterval(spawnObstacle, 900);
}

function stopRace() {
  raceRunning = false;
  clearInterval(obstacleInterval);
  raceObstacles.forEach(o => o.remove());
  raceObstacles = [];
}

function spawnObstacle() {
  if (!raceRunning) return;
  const obs = document.createElement('div');
  obs.className = 'race-obstacle';
  obs.style.left = (10 + Math.random() * 80) + '%';
  raceArea.appendChild(obs);
  raceObstacles.push(obs);
  moveObstacle(obs);
}

function moveObstacle(obs) {
  let top = -40;
  const move = setInterval(() => {
    top += 6;
    obs.style.top = top + 'px';
    if (top > raceArea.clientHeight) {
      clearInterval(move);
      obs.remove();
      raceObstacles = raceObstacles.filter(o => o !== obs);
      raceScore += 10;
      raceScoreEl.textContent = raceScore;
      if (raceScore % 50 === 0) addMoney(100);
      return;
    }
    // Colisión
    const carRect = raceCar.getBoundingClientRect();
    const obsRect = obs.getBoundingClientRect();
    if (carRect.left < obsRect.right && carRect.right > obsRect.left &&
        carRect.top < obsRect.bottom && carRect.bottom > obsRect.top) {
      clearInterval(move);
      obs.remove();
      raceObstacles = raceObstacles.filter(o => o !== obs);
      gameOver();
    }
  }, 30);
}

function gameOver() {
  stopRace();
  showNotification('💥 ¡Choque! Puntuación: ' + raceScore, '🏁');
  addMoney(raceScore / 10);
}

// Mover el carro con el dedo o el mouse
raceArea.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const rect = raceArea.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  moveCar(x / rect.width * 100);
}, { passive: false });

raceArea.addEventListener('mousemove', (e) => {
  const rect = raceArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  moveCar(x / rect.width * 100);
});

function moveCar(percent) {
  percent = Math.max(5, Math.min(95, percent));
  raceCar.style.left = percent + '%';
}

// Botón reiniciar
const raceRestart = document.getElementById('race-restart');
if (raceRestart) {
  raceRestart.addEventListener('click', () => {
    playSelect();
    startRace();
  });
}

// ===== MISIÓN COMPLETADA (demo) =====
const missionClose = document.getElementById('mission-close');
if (missionClose) {
  missionClose.addEventListener('click', () => {
    document.getElementById('mission-complete').classList.add('hidden');
  });
}

// ===== EASTER EGG: Código Konami =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      activateKonami();
    }
  } else {
    konamiIndex = 0;
  }
});

function activateKonami() {
  const box = document.getElementById('mission-complete');
  if (box) {
    document.getElementById('mission-text').textContent = '¡Easter Egg activado! 🎉 Bien hecho, Ani 💛';
    box.classList.remove('hidden');
    addMoney(500);
  }
}
