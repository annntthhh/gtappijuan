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
  document.getElementById('mini-map').classList.remove('hidden');
  document.getElementById('radio-panel').classList.remove('hidden');
  drawRoutes();
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
const playerRank = document.getElementById('player-rank');

function addMoney(amount) {
  money += amount;
  moneyAmount.textContent = '$' + money;
  updateRank();
  showNotification('💰 +$' + amount + ' conseguido');
}

// ===== RANGO DE LEYENDA =====
function updateRank() {
  let rank = 'NOVATO';
  if (money >= 1000) rank = 'LEYENDA';
  else if (money >= 500) rank = 'VETERANO';
  else if (money >= 200) rank = 'PISTOLERO';
  playerRank.textContent = rank;
  if (rank === 'LEYENDA') {
    showNotification('🏆 ¡Has alcanzado el rango LEYENDA!', '🏆');
  }
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

// ===== CONFETI =====
function launchConfetti() {
  const colors = ['#feca57', '#ff6b6b', '#1dd1a1', '#48dbfb', '#ff9f43', '#ff6b9d'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

// ===== SONIDOS =====
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playHover() {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 600;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function playSelect() {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 900;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// ===== FANFARRIA DE MISIÓN PASADA =====
function playMissionPassed() {
  try {
    const ctx = getAudio();
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    const times = [0, 0.15, 0.3, 0.45, 0.7, 0.85, 1.0];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = ctx.currentTime + times[i];
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  } catch (e) {}
}

// ===== MISIÓN COMPLETADA =====
function showMissionComplete(message) {
  document.getElementById('mission-text').textContent = message;
  document.getElementById('mission-complete').classList.remove('hidden');
  playMissionPassed();
  launchConfetti();
  addMoney(200);
}

const missionClose = document.getElementById('mission-close');
if (missionClose) {
  missionClose.addEventListener('click', () => {
    document.getElementById('mission-complete').classList.add('hidden');
  });
}

// ===== RADIO GTA =====
let radioOn = false;
let radioAudio = null;
let radioTuneInterval = null;

const radioPower = document.getElementById('radio-power');
const radioTune = document.getElementById('radio-tune');
const radioDisplay = document.getElementById('radio-display');

const songUrl = '';

radioPower.addEventListener('click', () => {
  playSelect();
  radioOn = !radioOn;
  if (radioOn) {
    radioPower.classList.add('on');
    radioDisplay.textContent = 'RADIO ON';
    showNotification('📻 Radio GTA encendida', '🎵');
    if (songUrl) {
      radioAudio = new Audio(songUrl);
      radioAudio.loop = true;
      radioAudio.volume = 0.6;
      radioAudio.play();
    } else {
      playRadioTune();
    }
  } else {
    radioPower.classList.remove('on');
    radioDisplay.textContent = 'RADIO GTA';
    showNotification('📻 Radio GTA apagada', '🔇');
    if (radioAudio) { radioAudio.pause(); radioAudio = null; }
    stopRadioTune();
  }
});

radioTune.addEventListener('click', () => {
  playSelect();
  if (radioOn) {
    showNotification('📻 Sintonizando...', '🎛️');
    stopRadioTune();
    playRadioTune();
  }
});

function playRadioTune() {
  const notes = [440, 493, 523, 587, 659, 698, 784, 880];
  let n = 0;
  radioTuneInterval = setInterval(() => {
    try {
      const ctx = getAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = notes[n % notes.length];
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      n++;
    } catch (e) {}
  }, 300);
}

function stopRadioTune() {
  clearInterval(radioTuneInterval);
}

// ===== GIRAR PANTALLA =====
const rotateBtn = document.getElementById('rotate-btn');
let isRotated = false;

rotateBtn.addEventListener('click', () => {
  playSelect();
  isRotated = !isRotated;
  if (isRotated) {
    document.documentElement.classList.add('landscape');
    rotateBtn.textContent = '📱 VERTICAL';
    showNotification('🔄 Pantalla girada', '📱');
  } else {
    document.documentElement.classList.remove('landscape');
    rotateBtn.textContent = '🔄 GIRAR';
    showNotification('📱 Modo vertical', '📱');
  }
});

// ===== PANTALLA DE PAUSA =====
const pauseBtn = document.getElementById('pause-btn');
const pauseOverlay = document.getElementById('pause-overlay');

function showPause() {
  pauseOverlay.classList.remove('hidden');
}

function hidePause() {
  pauseOverlay.classList.add('hidden');
}

pauseBtn.addEventListener('click', () => {
  playSelect();
  showPause();
});

document.getElementById('pause-resume').addEventListener('click', () => {
  playSelect();
  hidePause();
});

document.getElementById('pause-restart').addEventListener('click', () => {
  playSelect();
  hidePause();
  window.location.reload();
});

document.getElementById('pause-menu').addEventListener('click', () => {
  playSelect();
  hidePause();
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById('mapa-overlay').classList.add('hidden');
  document.getElementById('video-player').classList.add('hidden');
  document.getElementById('char-overlay').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
  stopRace();
});

// ===== MINI-MAPA =====
document.getElementById('mini-map').addEventListener('click', () => {
  playSelect();
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('mapa-overlay').classList.remove('hidden');
});

// ===== RUTAS DIBUJADAS =====
const routePoints = [
  { name: 'Budapest', x: 30, y: 20 },
  { name: 'Costa azul', x: 60, y: 35 },
  { name: 'Mi casa', x: 25, y: 50 },
  { name: 'Super 900', x: 55, y: 65 },
  { name: 'Marrufo', x: 40, y: 80 }
];

function drawRoutes() {
  const svg = document.querySelector('.map-routes');
  if (!svg) return;
  svg.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < routePoints.length - 1; i++) {
    const a = routePoints[i];
    const b = routePoints[i + 1];
    const path = document.createElementNS(ns, 'path');
    const mx = (a.x + b.x) / 2;
    path.setAttribute('d', `M ${a.x} ${a.y} Q ${mx} ${a.y} ${b.x} ${b.y}`);
    svg.appendChild(path);
  }
  const a = routePoints[routePoints.length - 1];
  const b = routePoints[0];
  const path = document.createElementNS(ns, 'path');
  const mx = (a.x + b.x) / 2;
  path.setAttribute('d', `M ${a.x} ${a.y} Q ${mx} ${a.y} ${b.x} ${b.y}`);
  svg.appendChild(path);
}

// ===== MODO NOCHE =====
const mapContainer = document.querySelector('.map-container');
const mapNight = document.querySelector('.map-night');
let lastTap = 0;

if (mapContainer) {
  mapContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('map-point')) return;
    const now = Date.now();
    if (now - lastTap < 400) {
      mapNight.classList.toggle('off');
      showNotification(mapNight.classList.contains('off') ? '🌙 Día' : '🌃 Vista de noche', '🌙');
    }
    lastTap = now;
  });
}

// ===== MAPA: puntos =====
const mapLabel = document.getElementById('map-label');

document.querySelectorAll('.map-point').forEach(point => {
  point.addEventListener('mouseenter', () => {
    showMapLabel(point);
  });
  point.addEventListener('mouseleave', () => {
    mapLabel.classList.remove('show');
  });
  point.addEventListener('click', () => {
    playSelect();
    showMapLabel(point);
    setTimeout(() => mapLabel.classList.remove('show'), 2500);
  });
});

function showMapLabel(point) {
  let text = point.getAttribute('data-name');
  const sub = point.getAttribute('data-sub');
  if (sub) text += ' — ' + sub;
  mapLabel.textContent = text;
  mapLabel.classList.add('show');
}

// ===== NAVEGACIÓN DEL MENÚ =====
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

// Botones de volver
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
    // Animar barras de estadísticas
    document.querySelectorAll('.stat-fill').forEach(fill => {
      const val = fill.getAttribute('data-val');
      setTimeout(() => { fill.style.width = val + '%'; }, 300);
    });
    document.getElementById('char-overlay').classList.remove('hidden');
  });
});

document.getElementById('close-char').addEventListener('click', () => {
  document.getElementById('char-overlay').classList.add('hidden');
});

// ===== GALERÍA =====
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

// ===== MISIONES =====
document.querySelectorAll('.mission-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('locked')) return;
    if (item.classList.contains('current')) {
      item.classList.remove('current');
      item.classList.add('done');
      item.querySelector('.mission-icon').textContent = '✔';
      showMissionComplete('¡Misión completada! +200 💰');
    } else if (item.classList.contains('done')) {
      showNotification('✔ Misión ya completada', '🏆');
    }
  });
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

const raceRestart = document.getElementById('race-restart');
if (raceRestart) {
  raceRestart.addEventListener('click', () => {
    playSelect();
    startRace();
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
  showMissionComplete('¡Easter Egg activado! 🎉 Bien hecho, Ani 💛');
}
