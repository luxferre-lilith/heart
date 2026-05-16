const btn = document.getElementById('decryptBtn');
const card = document.getElementById('card');
const scene = document.getElementById('heartScene');
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let started = false;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x, y };
}

function makeParticles() {
  particles = [];
  const scale = Math.min(innerWidth, innerHeight) / 34;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2 + 20;

  for (let i = 0; i < 950; i++) {
    const t = Math.random() * Math.PI * 2;
    const edge = heartPoint(t);
    const fill = Math.sqrt(Math.random());
    const targetX = cx + edge.x * scale * fill;
    const targetY = cy + edge.y * scale * fill;

    particles.push({
      text: Math.random() > .18 ? 'i love you' : 'love you',
      x: cx + (Math.random() - .5) * 40,
      y: cy + (Math.random() - .5) * 40,
      tx: targetX,
      ty: targetY,
      delay: Math.random() * 1000,
      size: 11 + Math.random() * 8,
      alpha: .45 + Math.random() * .55,
      spin: (Math.random() - .5) * .15
    });
  }
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

function animate(startTime) {
  const now = performance.now();
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = 'rgba(5,5,5,.22)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff4d9c';
  ctx.shadowBlur = 13;

  for (const p of particles) {
    const progress = Math.max(0, Math.min(1, (now - startTime - p.delay) / 2500));
    const e = easeOutCubic(progress);
    const x = p.x + (p.tx - p.x) * e;
    const y = p.y + (p.ty - p.y) * e;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.spin * Math.sin(now / 600));
    ctx.globalAlpha = p.alpha * Math.min(1, progress * 2.5);
    ctx.font = `700 ${p.size}px 'Fira Code', monospace`;
    ctx.fillStyle = progress < .98 ? '#ff83b9' : '#ff4d9c';
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }

  requestAnimationFrame(() => animate(startTime));
}

function decrypt() {
  if (started) return;
  started = true;
  makeParticles();
  card.classList.add('hide');
  scene.classList.add('show');
  setTimeout(() => requestAnimationFrame(t => animate(t)), 350);
}

btn.addEventListener('click', decrypt);
document.body.addEventListener('click', decrypt);
