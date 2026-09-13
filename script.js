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

// Navegación
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('mouseenter', playHover);
  btn.addEventListener('click', () => {
    playSelect();
    const target = btn.getAttribute('data-target');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById(target).classList.remove('hidden');
    window.scrollTo(0, 0);
  });
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('mouseenter', playHover);
  btn.addEventListener('click', () => {
    playSelect();
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById('main-menu').classList.remove('hidden');
  });
});

// ===== MISIÓN COMPLETADA =====
function showMissionComplete(text) {
  document.getElementById('mission-text').textContent = text;
  document.getElementById('mission-complete').classList.remove('hidden');
}

document.getElementById('mission-close').addEventListener('click', () => {
  playSelect();
  document.getElementById('mission-complete').classList.add('hidden');
});

// ===== MAPA =====
const mapPoints = document.querySelectorAll('.map-point');
const mapLabel = document.getElementById('map-label');

mapPoints.forEach(point => {
  point.addEventListener('click', () => {
    playSelect();
    const name = point.getAttribute('data-name');
    mapLabel.textContent = '📍 ' + name;
    mapLabel.classList.add('show');
    showMissionComplete('Has visitado: ' + name);
  });
});

document.querySelector('.map-container').addEventListener('click', (e) => {
  if (!e.target.classList.contains('map-point')) {
    mapLabel.classList.remove('show');
  }
});

// Easter egg: código Konami 🕹️
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      alert('🎉 ¡Código Konami activado! GTA: Juan Edition — Modo Dios');
      document.body.style.background = 'linear-gradient(135deg, #feca57, #e84118)';
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
