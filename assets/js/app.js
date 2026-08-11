/* ==========================================================================
   S.M. YUSUF CALCULUS & ANALYTIC GEOMETRY SIMULATIONS
   Interactive Application Script & Catalog Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initScrollReveal();
  initStatsCounter();
  initSimulationsCatalog();
  initModalManager();
  initGitCopy();
  initMobileNav();
});

/* ==========================================================================
   SIMULATIONS CATALOG & SEARCH / FILTER ENGINE
   ========================================================================== */
const FEATURED_SIMULATIONS = [
  {
    id: "fourier_series",
    title: "Fourier Series Simulator",
    category: "Differential Equations",
    path: "simulation/fourier_series_simulator.html",
    desc: "Decompose periodic signals into harmonic sine & cosine components. Interactive Gibbs phenomenon visualizer.",
    difficulty: "Advanced",
    time: "35 mins",
    tags: ["Series", "Fourier", "Harmonics", "Signal Processing"],
    previewType: "fourier"
  },
  {
    id: "limits_eps_delta",
    title: "Epsilon-Delta Limit Explorer",
    category: "Calculus",
    path: "chapters/chapter_1/continuty_eps_delta.html",
    desc: "Rigorous visual proof of limits and continuity. Adjust ε and δ bounds interactively on dynamic curve functions.",
    difficulty: "Beginner",
    time: "20 mins",
    tags: ["Limits", "Epsilon-Delta", "Continuity", "Analysis"],
    previewType: "limit"
  },
  {
    id: "mean_value_theorems",
    title: "Rolle's & Mean Value Theorems",
    category: "Calculus",
    path: "chapters/chapter_3/theorems1.html",
    desc: "Visualize secant and tangent parallel slope points c ∈ (a, b) across continuous differentiable functions.",
    difficulty: "Intermediate",
    time: "25 mins",
    tags: ["Theorems", "Derivatives", "Rolle", "MVT"],
    previewType: "mvt"
  },
  {
    id: "integral_calculus",
    title: "Interactive Integral & Area Visualizer",
    category: "Calculus",
    path: "chapters/chapter_5/calculus.html",
    desc: "Explore the Fundamental Theorem of Calculus with dynamic Riemann sums and antiderivative accumulator curves.",
    difficulty: "Intermediate",
    time: "30 mins",
    tags: ["Integration", "Riemann Sum", "Area", "FTC"],
    previewType: "integral"
  },
  {
    id: "quadric_surfaces",
    title: "3D Quadric Surfaces Atlas",
    category: "Analytic Geometry",
    path: "chapters/chapter_8/8-12-quadric-surfaces.html",
    desc: "Interactive 3D rendering of ellipsoids, hyperboloids of one & two sheets, elliptic paraboloids, and cones.",
    difficulty: "Advanced",
    time: "40 mins",
    tags: ["3D Geometry", "Surfaces", "Quadric", "Multivariable"],
    previewType: "quadric"
  },
  {
    id: "evolute_explorer",
    title: "Evolute & Curvature Center Explorer",
    category: "Analytic Geometry",
    path: "simulation/Evolute_Explorer_V2.html",
    desc: "Trace loci of centers of curvature for parametric curves like ellipses, parabolas, and cycloids.",
    difficulty: "Advanced",
    time: "30 mins",
    tags: ["Differential Geometry", "Curvature", "Evolute", "Locus"],
    previewType: "evolute"
  },
  {
    id: "polar_plotter",
    title: "Polar Curves & Coordinates Solver",
    category: "Analytic Geometry",
    path: "chapters/chapter_6/polar_plotter.html",
    desc: "Plot cardioids, limaçons, lemniscates, and roses in polar coordinates with area sweeps.",
    difficulty: "Intermediate",
    time: "25 mins",
    tags: ["Polar Coordinates", "Cardioid", "Roses", "Area"],
    previewType: "polar"
  },
  {
    id: "qibla_calculator",
    title: "3D Spherical Qibla Calculator",
    category: "Physics & Mechanics",
    path: "simulation/qibla.html",
    desc: "Geodesic navigation and great circle calculations using spherical trigonometry formulas on a 3D Earth globe.",
    difficulty: "Intermediate",
    time: "20 mins",
    tags: ["Spherical Geometry", "Trigonometry", "3D Globe", "Navigation"],
    previewType: "globe"
  },
  {
    id: "greens_theorem",
    title: "Green's Theorem in 3D & Line Integrals",
    category: "Differential Equations",
    path: "simulation/greens_theorem_3d.html",
    desc: "Visual verification of circulation vs double integrals over planar regions and vector fields.",
    difficulty: "Advanced",
    time: "45 mins",
    tags: ["Vector Calculus", "Line Integrals", "Curl", "Green Theorem"],
    previewType: "vector"
  },
  {
    id: "maclaurin_series",
    title: "Maclaurin & Taylor Polynomials",
    category: "Calculus",
    path: "simulation/maclaurin_simulator.html",
    desc: "Watch Taylor expansions converge to sin(x), cos(x), e^x, and ln(1+x) as degree increases.",
    difficulty: "Intermediate",
    time: "25 mins",
    tags: ["Taylor Series", "Maclaurin", "Approximation", "Polynomials"],
    previewType: "taylor"
  },
  {
    id: "moving_sofa",
    title: "Moving Sofa Problem Solver",
    category: "Visual Proofs",
    path: "simulation/Advanced Moving Sofa Problem Solver.html",
    desc: "Interactive optimization laboratory tracing maximal area shapes maneuvering through a right-angled hallway.",
    difficulty: "Advanced",
    time: "50 mins",
    tags: ["Optimization", "Geometry", "Moving Sofa", "Unsolved Math"],
    previewType: "sofa"
  },
  {
    id: "gaussian_integral",
    title: "The Gaussian Integral Visualizer",
    category: "Visual Proofs",
    path: "simulation/gaussian_integral_viz.html",
    desc: "Elegant visual transformation demonstrating why ∫ e^(-x²) dx = √π using polar double integration.",
    difficulty: "Advanced",
    time: "35 mins",
    tags: ["Integration", "Gaussian", "Polar Coordinates", "Proof"],
    previewType: "gaussian"
  }
];

function initSimulationsCatalog() {
  const gridContainer = document.getElementById('simulations-grid');
  const searchInput = document.getElementById('sim-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (!gridContainer) return;

  let currentCategory = 'All';
  let searchQuery = '';

  function renderCards() {
    const filtered = FEATURED_SIMULATIONS.filter(sim => {
      const matchCat = (currentCategory === 'All') || (sim.category === currentCategory);
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        sim.title.toLowerCase().includes(q) ||
        sim.desc.toLowerCase().includes(q) ||
        sim.tags.some(t => t.toLowerCase().includes(q)) ||
        sim.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem auto; color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">No simulations found</h4>
          <p>Try searching for another topic like 'Fourier', 'Limits', 'Vector', or 'Integrals'</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(sim => `
      <div class="glass-card sim-card reveal-on-scroll">
        <div class="sim-preview-stage">
          ${getSvgPreview(sim.previewType)}
        </div>
        <div class="sim-card-body">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="chapter-number">${sim.category}</span>
            <span class="chapter-badge badge-${sim.difficulty.toLowerCase()}">${sim.difficulty}</span>
          </div>
          <h3 class="sim-card-title">${sim.title}</h3>
          <p class="sim-card-desc">${sim.desc}</p>
          <div class="sim-tags">
            ${sim.tags.map(t => `<span class="sim-tag">#${t}</span>`).join('')}
          </div>
          <div class="sim-card-actions">
            <span class="chapter-meta">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${sim.time}
            </span>
            <button class="btn btn-primary btn-sm launch-modal-btn" data-title="${sim.title}" data-path="${sim.path}">
              Launch Sim ↗
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-bind modal buttons & reveal animations
    initModalTriggers();
    initScrollReveal();
  }

  // Event Listeners for Search & Filters
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
      renderCards();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderCards();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-filter') || 'All';
      renderCards();
    });
  });

  renderCards();
}

/* Helper SVG preview generator for simulation cards */
function getSvgPreview(type) {
  switch (type) {
    case 'fourier':
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <path d="M 20 90 Q 60 10, 100 90 T 180 90 T 260 90 T 340 90" stroke="#00E5FF" stroke-width="3" fill="none"/>
        <path d="M 20 90 Q 40 40, 60 90 T 100 90 T 140 90 T 180 90" stroke="#7C3AED" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
        <line x1="20" y1="90" x2="380" y2="90" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      </svg>`;
    case 'limit':
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <path d="M 40 140 Q 200 120, 360 40" stroke="#00E5FF" stroke-width="3"/>
        <rect x="160" y="50" width="80" height="70" fill="rgba(124, 58, 237, 0.2)" stroke="#7C3AED" stroke-dasharray="4 4"/>
        <circle cx="200" cy="85" r="5" fill="#00E5FF"/>
      </svg>`;
    case 'mvt':
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <path d="M 40 140 C 120 20, 280 180, 360 40" stroke="#00E5FF" stroke-width="3"/>
        <line x1="40" y1="140" x2="360" y2="40" stroke="#7C3AED" stroke-width="2" stroke-dasharray="6 6"/>
        <line x1="120" y1="40" x2="260" y2="150" stroke="#10B981" stroke-width="2"/>
        <circle cx="190" cy="95" r="5" fill="#10B981"/>
      </svg>`;
    case 'integral':
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <path d="M 40 140 Q 180 20, 360 140 L 360 160 L 40 160 Z" fill="rgba(0, 229, 255, 0.15)"/>
        <path d="M 40 140 Q 180 20, 360 140" stroke="#00E5FF" stroke-width="3"/>
        <line x1="100" y1="110" x2="100" y2="160" stroke="#7C3AED" stroke-width="15" opacity="0.6"/>
        <line x1="160" y1="65" x2="160" y2="160" stroke="#7C3AED" stroke-width="15" opacity="0.6"/>
        <line x1="220" y1="55" x2="220" y2="160" stroke="#7C3AED" stroke-width="15" opacity="0.6"/>
        <line x1="280" y1="85" x2="280" y2="160" stroke="#7C3AED" stroke-width="15" opacity="0.6"/>
      </svg>`;
    case 'quadric':
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <ellipse cx="200" cy="90" rx="120" ry="50" stroke="#00E5FF" stroke-width="2" fill="none"/>
        <ellipse cx="200" cy="90" rx="60" ry="70" stroke="#7C3AED" stroke-width="2" fill="none"/>
        <line x1="80" y1="90" x2="320" y2="90" stroke="rgba(255,255,255,0.2)"/>
        <line x1="200" y1="20" x2="200" y2="160" stroke="rgba(255,255,255,0.2)"/>
      </svg>`;
    default:
      return `<svg class="sim-preview-svg" viewBox="0 0 400 180" fill="none">
        <circle cx="200" cy="90" r="60" stroke="#00E5FF" stroke-width="3" stroke-dasharray="10 5"/>
        <path d="M 140 90 Q 200 30, 260 90" stroke="#7C3AED" stroke-width="3"/>
      </svg>`;
  }
}

/* ==========================================================================
   MODAL MANAGER (IFRAME SIMULATION RUNNER)
   ========================================================================== */
function initModalManager() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const iframe = document.getElementById('modal-iframe');
  const openFullBtn = document.getElementById('modal-open-full');

  if (!overlay || !closeBtn || !iframe) return;

  window.openSimModal = function(title, path) {
    modalTitle.textContent = title;
    iframe.src = path;
    openFullBtn.href = path;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    overlay.classList.remove('active');
    iframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function initModalTriggers() {
  document.querySelectorAll('.launch-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title');
      const path = btn.getAttribute('data-path');
      if (window.openSimModal) window.openSimModal(title, path);
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* ==========================================================================
   ANIMATED HERO STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 1500;
        const step = Math.max(1, Math.floor(target / (duration / 16)));

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = count + suffix;
          }
        }, 16);
      });
    }
  }, { threshold: 0.5 });

  const statsElem = document.querySelector('.stats-grid');
  if (statsElem) observer.observe(statsElem);
}

/* ==========================================================================
   GIT CLONE COPY FUNCTIONALITY
   ========================================================================== */
function initGitCopy() {
  const copyBtn = document.getElementById('copy-git-btn');
  const codeElem = document.getElementById('git-clone-code');

  if (!copyBtn || !codeElem) return;

  copyBtn.addEventListener('click', () => {
    const codeText = codeElem.textContent.trim();
    navigator.clipboard.writeText(codeText).then(() => {
      copyBtn.textContent = 'Copied! ✓';
      copyBtn.style.background = 'rgba(16, 185, 129, 0.25)';
      copyBtn.style.color = '#10B981';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    });
  });
}

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isFlex = navLinks.style.display === 'flex';
    navLinks.style.display = isFlex ? 'none' : 'flex';
    if (!isFlex) {
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(5, 8, 22, 0.95)';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid var(--border-glass)';
    }
  });
}
