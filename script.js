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

// Navegación del menú
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

// Botones de volver (incluye cerrar mapa y cerrar video)
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('mouseenter', playHover);
  btn.addEventListener('click', () => {
    playSelect();
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById('mapa-overlay').classList.add('hidden');
    document.getElementById('video-player').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
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
  }
}
