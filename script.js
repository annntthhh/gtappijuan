// Papantalla de carga
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

// Navegación entre secciones
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById(target).classList.remove('hidden');
    window.scrollTo(0, 0);
  });
});

// Botones de volver
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById('main-menu').classList.remove('hidden');
  });
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
