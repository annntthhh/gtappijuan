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
  // Fundido suave: primero baja la opacidad, cambia la imagen, sube de nuevo
  menuBg.style.opacity = '0';
  setTimeout(() => {
    menuBg.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url('${backgrounds[bgIndex]}')`;
    menuBg.style.opacity = '1';
  }, 2000); // 2s de fundido
}

setInterval(changeBackground, 10000); // cada 10 segundos

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
