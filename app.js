const boyfriendName = 'Joe';
const hiddenTitle = `For my darling, ${boyfriendName}`;
const hiddenMessage = `You're the best!`;

const btn = document.getElementById('decryptBtn');
const card = document.getElementById('card');
const scene = document.getElementById('heartScene');
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const messageBtn = document.getElementById('messageBtn');
const loveNote = document.getElementById('loveNote');
const closeNote = document.getElementById('closeNote');
const typeLine = document.getElementById('typeLine');
const nameSlot = document.getElementById('nameSlot');
const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');

nameSlot.textContent = boyfriendName;
noteTitle.textContent = hiddenTitle;
noteBody.innerHTML = hiddenMessage;

let particles = [];
let started = false;
let animationStart = 0;

function typeText(text, i = 0) {
  typeLine.textContent = text.slice(0, i);
  if (i < text.length) setTimeout(() => typeText(text, i + 1), 42);
}
typeText('[system] Initializing heart.PROTOCOL_v2.0...');

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (started) makeParticles();
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
  const cy = innerHeight / 2 + 10;

  for (let i = 0; i < 1250; i++) {
    const t = Math.random() * Math.PI * 2;
    const edge = heartPoint(t);
    const fill = Math.sqrt(Math.random());
    const targetX = cx + edge.x * scale * fill;
    const targetY = cy + edge.y * scale * fill;

    particles.push({
      text: Math.random() > .2 ? 'soulmate.exe' : boyfriendName,
      x: targetX + (Math.random() - .5) * 28,
      y: targetY + 90 + Math.random() * 60,
      tx: targetX,
      ty: targetY,
      delay: Math.random() * 1800,
      size: 10 + Math.random() * 8,
      alpha: .45 + Math.random() * .55,
      spin: (Math.random() - .5) * .16,
      hueShift: Math.random()
    });
  }
}

function easeOutCubic(x) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function drawGlow(cx, cy, elapsed) {
  const pulse = .75 + Math.sin(elapsed / 420) * .12;
  const grd = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(innerWidth, innerHeight) * .48 * pulse);
  grd.addColorStop(0, 'rgba(255,77,156,.32)');
  grd.addColorStop(.45, 'rgba(255,31,109,.14)');
  grd.addColorStop(1, 'rgba(255,31,109,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, innerWidth, innerHeight);
}

function animate() {
  const now = performance.now();
  const elapsed = now - animationStart;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = 'rgba(4,3,8,.25)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  const cx = innerWidth / 2;
  const cy = innerHeight / 2 + 10;
  drawGlow(cx, cy, elapsed);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff4d9c';
  ctx.shadowBlur = 16;

  for (const p of particles) {
    const progress = Math.max(0, Math.min(1, (now - animationStart - p.delay) / 2800));
    const e = easeOutCubic(progress);
    const x = p.x + (p.tx - p.x) * e + Math.sin((elapsed / 700) + p.delay) * (1 - e) * 18;
    const y = p.y + (p.ty - p.y) * e;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.spin * Math.sin(now / 600));
    ctx.globalAlpha = p.alpha * Math.min(1, progress * 2.5);
    ctx.font = `700 ${p.size}px 'Fira Code', monospace`;
    ctx.fillStyle = p.hueShift > .78 ? '#7df9ff' : (progress < .98 ? '#ff9ac8' : '#ff4d9c');
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }

  requestAnimationFrame(animate);
}

function decrypt(event) {
  if (event) event.stopPropagation();
  if (started) return;
  started = true;
  makeParticles();
  card.classList.add('hide');
  scene.classList.add('show');
  setTimeout(() => {
    animationStart = performance.now();
    requestAnimationFrame(animate);
  }, 350);
  setTimeout(() => messageBtn.classList.remove('hidden'), 4300);
}

btn.addEventListener('click', decrypt);
document.body.addEventListener('click', decrypt);
messageBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  loveNote.showModal();
});
closeNote.addEventListener('click', () => loveNote.close());
