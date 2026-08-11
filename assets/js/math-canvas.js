/* ==========================================================================
   S.M. YUSUF CALCULUS & ANALYTIC GEOMETRY SIMULATIONS
   Interactive Math Canvas Engine & Visual Lab Renderer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMathCanvas();
  initVisualLabCanvas();
});

/* ==========================================================================
   1. HERO BACKGROUND MATHEMATICAL PARTICLE CANVAS
   ========================================================================== */
function initHeroMathCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: null, y: null, radius: 180 };

  const MATH_SYMBOLS = ['∫', '∑', 'd/dx', '∞', 'θ', '∇', 'π', 'λ', '∂', '∬', 'e^{iπ}', '∇×F', 'lim', 'dx', 'f(x)'];
  const particles = [];
  const PARTICLE_COUNT = 45;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class MathParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.symbol = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
      this.size = Math.random() * 12 + 12;
      this.baseAlpha = Math.random() * 0.4 + 0.15;
      this.alpha = this.baseAlpha;
      this.color = Math.random() > 0.4 ? '#00E5FF' : '#7C3AED';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion / attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
          this.alpha = Math.min(0.9, this.baseAlpha + force * 0.5);
        } else {
          this.alpha = this.baseAlpha;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `${this.size}px "Fira Code", monospace`;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new MathParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw faint constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. INTERACTIVE MATHEMATICS SHOWCASE VISUAL LAB CANVAS
   ========================================================================== */
function initVisualLabCanvas() {
  const canvas = document.getElementById('lab-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const presetSelect = document.getElementById('lab-preset-select');
  const sliderA = document.getElementById('lab-slider-a');
  const sliderB = document.getElementById('lab-slider-b');
  const labelA = document.getElementById('lab-label-a');
  const labelB = document.getElementById('lab-label-b');
  const valA = document.getElementById('lab-val-a');
  const valB = document.getElementById('lab-val-b');
  const formulaOverlay = document.getElementById('lab-formula-overlay');

  let width, height;
  let time = 0;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Presets State
  let currentPreset = 'tangent';
  let paramA = parseFloat(sliderA?.value || 2);
  let paramB = parseFloat(sliderB?.value || 5);

  function updateControls() {
    currentPreset = presetSelect ? presetSelect.value : 'tangent';
    paramA = parseFloat(sliderA.value);
    paramB = parseFloat(sliderB.value);

    if (currentPreset === 'tangent') {
      labelA.textContent = 'Tangent Point (x₀):';
      labelB.textContent = 'Frequency (k):';
      valA.textContent = paramA.toFixed(1);
      valB.textContent = paramB.toFixed(1);
      formulaOverlay.innerHTML = `f(x) = sin(${paramB.toFixed(1)}x), &nbsp; Tangent at x₀ = ${paramA.toFixed(1)}`;
    } else if (currentPreset === 'riemann') {
      labelA.textContent = 'Partition Count (N):';
      labelB.textContent = 'Curvature (k):';
      valA.textContent = Math.round(paramA);
      valB.textContent = paramB.toFixed(1);
      formulaOverlay.innerHTML = `∫ f(x)dx &approx; ∑ f(xᵢ)&Delta;x &nbsp; [N = ${Math.round(paramA)} Rectangles]`;
    } else if (currentPreset === 'fourier') {
      labelA.textContent = 'Harmonics (N):';
      labelB.textContent = 'Wave Speed:';
      valA.textContent = Math.round(paramA);
      valB.textContent = paramB.toFixed(1);
      formulaOverlay.innerHTML = `f(t) = (4/&pi;) &sum; [sin(n t)/n] &nbsp; [${Math.round(paramA)} Harmonics]`;
    } else if (currentPreset === 'polar') {
      labelA.textContent = 'Petals (k):';
      labelB.textContent = 'Scale Factor:';
      valA.textContent = Math.round(paramA);
      valB.textContent = paramB.toFixed(1);
      formulaOverlay.innerHTML = `r(&theta;) = ${paramB.toFixed(1)} &middot; cos(${Math.round(paramA)}&theta;) &nbsp; [Polar Rose]`;
    } else if (currentPreset === 'saddle') {
      labelA.textContent = 'Rotation Speed:';
      labelB.textContent = 'Curvature:';
      valA.textContent = paramA.toFixed(1);
      valB.textContent = paramB.toFixed(1);
      formulaOverlay.innerHTML = `z = x² - y² &nbsp; [3D Paraboloid Wireframe]`;
    }
  }

  if (presetSelect) presetSelect.addEventListener('change', updateControls);
  if (sliderA) sliderA.addEventListener('input', updateControls);
  if (sliderB) sliderB.addEventListener('input', updateControls);

  updateControls();

  // Main Render Loop
  function render() {
    time += 0.02;
    ctx.clearRect(0, 0, width, height);

    // Draw Grid & Axes
    drawAxes();

    if (currentPreset === 'tangent') {
      renderTangentPreset();
    } else if (currentPreset === 'riemann') {
      renderRiemannPreset();
    } else if (currentPreset === 'fourier') {
      renderFourierPreset();
    } else if (currentPreset === 'polar') {
      renderPolarPreset();
    } else if (currentPreset === 'saddle') {
      renderSaddlePreset();
    }

    requestAnimationFrame(render);
  }

  function drawAxes() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // Grid lines
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();
  }

  /* Preset 1: Tangent Line & Derivative Slope */
  function renderTangentPreset() {
    const cx = width / 2;
    const cy = height / 2;
    const scaleX = 60;
    const scaleY = 80;
    const k = paramB * 0.5;

    // Function f(x) = sin(k * x)
    function f(x) { return Math.sin(k * x); }
    function df(x) { return k * Math.cos(k * x); }

    // Plot Curve
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00E5FF';

    for (let px = 0; px < width; px++) {
      const x = (px - cx) / scaleX;
      const y = f(x);
      const py = cy - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Tangent Point x0
    const x0 = (paramA - 5) * 0.6;
    const y0 = f(x0);
    const slope = df(x0);

    const px0 = cx + x0 * scaleX;
    const py0 = cy - y0 * scaleY;

    // Draw Tangent Line
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#7C3AED';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#7C3AED';

    const dx = 2.5;
    const tangentStartPX = cx + (x0 - dx) * scaleX;
    const tangentStartPY = cy - (y0 - slope * dx) * scaleY;
    const tangentEndPX = cx + (x0 + dx) * scaleX;
    const tangentEndPY = cy - (y0 + slope * dx) * scaleY;

    ctx.moveTo(tangentStartPX, tangentStartPY);
    ctx.lineTo(tangentEndPX, tangentEndPY);
    ctx.stroke();

    // Point Dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(px0, py0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Slope Badge
    ctx.font = '13px "Fira Code", monospace';
    ctx.fillStyle = '#10B981';
    ctx.fillText(`Slope m = f'(${x0.toFixed(2)}) = ${slope.toFixed(2)}`, px0 + 15, py0 - 15);
    ctx.restore();
  }

  /* Preset 2: Riemann Integral Sum */
  function renderRiemannPreset() {
    const cx = width / 2;
    const cy = height / 2 + 50;
    const scaleX = 50;
    const scaleY = 40;

    const N = Math.max(4, Math.round(paramA * 3));
    const k = paramB * 0.4;

    function f(x) { return 0.2 * x * x + Math.sin(k * x) + 1.5; }

    const a = -3.5;
    const b = 3.5;
    const dx = (b - a) / N;

    // Draw Rectangles
    ctx.save();
    for (let i = 0; i < N; i++) {
      const xi = a + i * dx;
      const yi = f(xi);
      const px = cx + xi * scaleX;
      const py = cy - yi * scaleY;
      const pw = dx * scaleX;
      const ph = yi * scaleY;

      ctx.fillStyle = 'rgba(124, 58, 237, 0.35)';
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 1;
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeRect(px, py, pw, ph);
    }

    // Draw Smooth Curve Over Rectangles
    ctx.beginPath();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00E5FF';

    for (let px = 0; px < width; px++) {
      const x = (px - cx) / scaleX;
      const y = f(x);
      const py = cy - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* Preset 3: Fourier Harmonics Synthesis */
  function renderFourierPreset() {
    const N = Math.max(1, Math.round(paramA * 1.5));
    const speed = paramB * 0.02;

    const startX = 180;
    const startY = height / 2;
    let x = startX;
    let y = startY;

    ctx.save();

    // Draw Harmonics Circles
    for (let i = 0; i < N; i++) {
      const prevX = x;
      const prevY = y;
      const n = i * 2 + 1;
      const radius = 65 * (4 / (n * Math.PI));

      x += radius * Math.cos(n * time * speed);
      y += radius * Math.sin(n * time * speed);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 1.5;
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Wave Trace Line
    ctx.beginPath();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00E5FF';
    ctx.moveTo(x, y);
    ctx.lineTo(320, y);
    ctx.stroke();

    ctx.restore();
  }

  /* Preset 4: Polar Curves (Rose Curve) */
  function renderPolarPreset() {
    const cx = width / 2;
    const cy = height / 2;
    const k = Math.round(paramA);
    const R = paramB * 18;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00E5FF';

    const maxTheta = Math.PI * 2;
    for (let theta = 0; theta <= maxTheta; theta += 0.02) {
      const r = R * Math.cos(k * theta);
      const px = cx + r * Math.cos(theta);
      const py = cy - r * Math.sin(theta);
      if (theta === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* Preset 5: 3D Saddle Surface Wireframe */
  function renderSaddlePreset() {
    const cx = width / 2;
    const cy = height / 2;
    const rotSpeed = paramA * 0.01;
    const rotAngle = time * rotSpeed;

    ctx.save();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1;

    const gridSize = 16;
    const step = 20;

    for (let ix = -gridSize; ix <= gridSize; ix += 2) {
      ctx.beginPath();
      for (let iy = -gridSize; iy <= gridSize; iy += 2) {
        const x = ix * step * 0.15;
        const y = iy * step * 0.15;
        const z = (x * x - y * y) * 0.1 * (paramB * 0.3);

        // 3D Isometric projection with rotation
        const rx = x * Math.cos(rotAngle) - y * Math.sin(rotAngle);
        const ry = x * Math.sin(rotAngle) + y * Math.cos(rotAngle);

        const px = cx + (rx - ry) * Math.cos(Math.PI / 6) * 12;
        const py = cy + (rx + ry) * Math.sin(Math.PI / 6) * 6 - z * 10;

        if (iy === -gridSize) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  render();
}
