// ============================================================
// GAME — main loop, input, state machine, panel management
// ============================================================

// States
const STATE = { WORLD: 'world', PANEL: 'panel' };

let state       = STATE.WORLD;
let activePanel = null;          // id string of open panel
let nearBuilding = null;         // building player is near

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');
const W      = WORLD_COLS * TILE_SIZE;  // 480
const H      = WORLD_ROWS * TILE_SIZE;  // 272
canvas.width  = W;
canvas.height = H;

// ============================================================
// INPUT
// ============================================================

const KEY_MAP = {
  ArrowUp:    'up',    w: 'up',    W: 'up',
  ArrowDown:  'down',  s: 'down',  S: 'down',
  ArrowLeft:  'left',  a: 'left',  A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

document.addEventListener('keydown', e => {
  const dir = KEY_MAP[e.key];
  if (dir) {
    Player.keys[dir] = true;
    Player.clearTarget();
    e.preventDefault();
  }
  if ((e.key === ' ' || e.key === 'Enter') && state === STATE.WORLD) {
    tryInteract();
    e.preventDefault();
  }
  if (e.key === 'Escape') {
    closePanel();
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  const dir = KEY_MAP[e.key];
  if (dir) Player.keys[dir] = false;
});

// Click / tap to move — translate CSS pixel → canvas pixel
canvas.addEventListener('click', e => {
  if (state !== STATE.WORLD) return;
  const rect   = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const wx     = (e.clientX - rect.left) * scaleX;
  const wy     = (e.clientY - rect.top)  * scaleY;

  // Check if clicked on a building (by checking which tile)
  const col = Math.floor(wx / TILE_SIZE);
  const row = Math.floor(wy / TILE_SIZE);
  const clicked = getBuildingAtTile(col, row);

  if (clicked) {
    // Walk to door tile then enter
    const doorX = (clicked.doorTile.tx + 0.5) * TILE_SIZE;
    const doorY = (clicked.doorTile.ty + 0.5) * TILE_SIZE;
    Player.setMoveTarget(doorX, doorY);
    // Set pending open so we open when we arrive
    pendingBuildingOpen = clicked;
  } else {
    Player.setMoveTarget(wx, wy);
    pendingBuildingOpen = null;
  }
});

// Touch
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch  = e.changedTouches[0];
  const rect   = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const wx     = (touch.clientX - rect.left) * scaleX;
  const wy     = (touch.clientY - rect.top)  * scaleY;
  const col    = Math.floor(wx / TILE_SIZE);
  const row    = Math.floor(wy / TILE_SIZE);
  const clicked = getBuildingAtTile(col, row);
  if (clicked) {
    const doorX = (clicked.doorTile.tx + 0.5) * TILE_SIZE;
    const doorY = (clicked.doorTile.ty + 0.5) * TILE_SIZE;
    Player.setMoveTarget(doorX, doorY);
    pendingBuildingOpen = clicked;
  } else {
    Player.setMoveTarget(wx, wy);
    pendingBuildingOpen = null;
  }
}, { passive: false });

// Exit buttons inside panels
document.querySelectorAll('.exit-btn').forEach(btn => {
  btn.addEventListener('click', () => closePanel());
});

// Project frames in gallery
document.querySelectorAll('.frame').forEach(frame => {
  frame.addEventListener('click', () => {
    const id = frame.dataset.project;
    openProjectDetail(id);
  });
});

document.querySelector('.detail-close')?.addEventListener('click', () => {
  document.getElementById('project-detail').classList.remove('active');
  document.getElementById('project-detail').setAttribute('aria-hidden', 'true');
});

// ============================================================
// BUILDING INTERACTION
// ============================================================

let pendingBuildingOpen = null;

function getBuildingAtTile(col, row) {
  return BUILDINGS.find(b =>
    col >= b.tx && col < b.tx + b.tw &&
    row >= b.ty && row < b.ty + b.th
  ) || null;
}

function tryInteract() {
  if (!nearBuilding) return;
  openPanel(nearBuilding.panel);
}

function checkProximity() {
  const col = Player.tileCol();
  const row = Player.tileRow();
  // Check if player is adjacent to a door tile
  for (const b of BUILDINGS) {
    const { tx, ty } = b.doorTile;
    const dist = Math.abs(col - tx) + Math.abs(row - ty);
    if (dist <= 1) {
      return b;
    }
  }
  return null;
}

// ============================================================
// PANEL MANAGEMENT
// ============================================================

function openPanel(panelId) {
  if (state === STATE.PANEL) return;
  state = STATE.PANEL;
  activePanel = panelId;

  const el = document.getElementById(`panel-${panelId}`);
  if (!el) return;

  // Fade canvas out
  canvas.style.transition = 'opacity 0.3s';
  canvas.style.opacity = '0';

  setTimeout(() => {
    el.classList.add('active');
    el.removeAttribute('aria-hidden');
    el.focus();
  }, 300);
}

function closePanel() {
  if (state !== STATE.PANEL) return;

  const el = document.getElementById(`panel-${activePanel}`);
  if (el) {
    el.classList.remove('active');
    el.setAttribute('aria-hidden', 'true');
  }

  // Close any detail overlay
  const detail = document.getElementById('project-detail');
  if (detail) {
    detail.classList.remove('active');
    detail.setAttribute('aria-hidden', 'true');
  }

  canvas.style.opacity = '1';
  state = STATE.WORLD;
  activePanel = null;
  pendingBuildingOpen = null;
}

// ============================================================
// PROJECT DETAIL (gallery)
// ============================================================

const PROJECT_DATA = {
  exodus: {
    title: 'EXODUS',
    tech:  'Unreal Engine / C++',
    desc:  'AAA sci-fi RPG developed at Archetype Entertainment. Contributed to core gameplay systems.',
    link:  'https://archetypeentertainment.com/',
  },
  vanguard: {
    title: 'Vanguard Exiles',
    tech:  'Unity / C#',
    desc:  'Tactical auto-battler released on Steam 2025. Developed at The Tea Division.',
    link:  'https://store.steampowered.com/',
  },
  zomboid: {
    title: 'Project Zomboid',
    tech:  'Java',
    desc:  'Contributed improvements to the popular survival RPG in the Build 41 update.',
    link:  'https://projectzomboid.com/',
  },
  sackboy: {
    title: 'Sackboy: A Big Adventure',
    tech:  'Unreal Engine / C++',
    desc:  'Worked on the PlayStation to PC port for this Sony platformer.',
    link:  'https://www.playstation.com/',
  },
};

function openProjectDetail(id) {
  const data = PROJECT_DATA[id];
  if (!data) return;
  const overlay = document.getElementById('project-detail');
  overlay.querySelector('.detail-title').textContent = data.title;
  overlay.querySelector('.detail-tech').textContent  = data.tech;
  overlay.querySelector('.detail-desc').textContent  = data.desc;
  const link = overlay.querySelector('.detail-link');
  link.href = data.link;
  overlay.classList.add('active');
  overlay.removeAttribute('aria-hidden');
}

// ============================================================
// EMAIL OBFUSCATION
// ============================================================

(function() {
  const parts = ['scott', '@', 'purcival', '.com'];
  const email = parts.join('');
  const display = document.getElementById('contact-email-display');
  if (display) display.textContent = email;

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.elements.name.value;
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body    = encodeURIComponent(form.elements.message.value);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  }
})();

// ============================================================
// INTERACTION HINT UI
// ============================================================

const hintEl = document.getElementById('interact-hint');

function updateHint(building) {
  if (building) {
    hintEl.classList.add('visible');
  } else {
    hintEl.classList.remove('visible');
  }
}

// ============================================================
// MAIN LOOP
// ============================================================

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (state !== STATE.WORLD) return;

  // Check if we've reached a pending building door
  if (pendingBuildingOpen) {
    const dx = Math.abs(Player.x + Player.w / 2 - (pendingBuildingOpen.doorTile.tx + 0.5) * TILE_SIZE);
    const dy = Math.abs(Player.y + Player.h / 2 - (pendingBuildingOpen.doorTile.ty + 0.5) * TILE_SIZE);
    if (dx < TILE_SIZE && dy < TILE_SIZE) {
      const target = pendingBuildingOpen;
      pendingBuildingOpen = null;
      Player.clearTarget();
      openPanel(target.panel);
      return;
    }
  }

  Player.update();

  // Update proximity / hint
  nearBuilding = checkProximity();
  updateHint(nearBuilding);

  // Draw
  ctx.clearRect(0, 0, W, H);
  drawWorld(ctx);
  Player.draw(ctx);

}

// Wait for Press Start 2P to load before starting so canvas text renders correctly
document.fonts.ready.then(() => gameLoop());
