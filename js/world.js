// ============================================================
// WORLD — tilemap, buildings, collision
// ============================================================

const T = { GRASS: 0, PATH: 1, TREE: 2, WATER: 3 };
const WORLD_COLS = 30;
const WORLD_ROWS = 17;
const TILE_SIZE  = 16;
const TS = TILE_SIZE;

// Redesigned tilemap: horizontal boulevards at rows 8 & 14,
// vertical lanes at cols 4 & 22 connecting all building doors.
const TILEMAP = [
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
];

const BUILDINGS = [
  { id:'gallery',  label:'Art Gallery',  panel:'gallery',  tx:2,  ty:1,  tw:5, th:4, doorTile:{tx:4,  ty:4}  },
  { id:'news',     label:'Newsagency',   panel:'news',     tx:20, ty:1,  tw:5, th:4, doorTile:{tx:22, ty:5}  },
  { id:'notice',   label:'About',        panel:'notice',   tx:2,  ty:10, tw:5, th:4, doorTile:{tx:4,  ty:14} },
  { id:'post',     label:'Post Office',  panel:'post',     tx:20, ty:10, tw:5, th:4, doorTile:{tx:22, ty:14} },
  { id:'monument', label:'Monument',     panel:'monument', tx:13, ty:5,  tw:4, th:3, doorTile:{tx:14, ty:8}  },
];

// ---- Collision -------------------------------------------------------

function buildCollisionMap() {
  const blocked = new Set();
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      if (TILEMAP[row][col] === T.TREE || TILEMAP[row][col] === T.WATER)
        blocked.add(`${col},${row}`);
    }
  }
  for (const b of BUILDINGS) {
    for (let r = b.ty; r < b.ty + b.th; r++)
      for (let c = b.tx; c < b.tx + b.tw; c++)
        blocked.add(`${c},${r}`);
  }
  return blocked;
}

const COLLISION_MAP = buildCollisionMap();

function isTileBlocked(col, row) {
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return true;
  return COLLISION_MAP.has(`${col},${row}`);
}

function getBuildingAtDoor(col, row) {
  return BUILDINGS.find(b => b.doorTile.tx === col && b.doorTile.ty === row) || null;
}

// ---- Tile drawing ----------------------------------------------------

function drawGrassTile(ctx, col, row) {
  const x = col * TS, y = row * TS;
  ctx.fillStyle = '#4a7c3f';
  ctx.fillRect(x, y, TS, TS);
  if ((col * 3 + row * 7) % 5 === 0) {
    ctx.fillStyle = '#3d6b34';
    ctx.fillRect(x + 4, y + 4, 4, 4);
  }
  if ((col * 11 + row * 5) % 7 === 0) {
    ctx.fillStyle = '#5a9248';
    ctx.fillRect(x + 9, y + 2, 2, 3);
    ctx.fillRect(x + 8, y + 1, 1, 4);
  }
  if ((col * 7 + row * 13) % 11 === 0) {
    ctx.fillStyle = '#3d6b34';
    ctx.fillRect(x + 1, y + 10, 4, 4);
  }
}

function drawPathTile(ctx, col, row) {
  const x = col * TS, y = row * TS;
  ctx.fillStyle = '#c4a468';
  ctx.fillRect(x, y, TS, TS);
  ctx.fillStyle = '#a88850';
  ctx.fillRect(x, y, TS, 1);
  ctx.fillRect(x, y, 1, TS);
  if ((col + row) % 2 === 0) {
    ctx.fillRect(x + 8, y + 1, 1, 7);
    ctx.fillRect(x + 1, y + 8, 7, 1);
    ctx.fillStyle = '#d4b478';
    ctx.fillRect(x + 2, y + 2, 5, 5);
    ctx.fillRect(x + 10, y + 10, 4, 4);
  } else {
    ctx.fillRect(x + 6, y + 1, 1, 8);
    ctx.fillRect(x + 1, y + 10, 9, 1);
    ctx.fillStyle = '#d4b478';
    ctx.fillRect(x + 2, y + 2, 3, 7);
    ctx.fillRect(x + 8, y + 3, 6, 4);
  }
}

function drawTreeTile(ctx, col, row) {
  const x = col * TS, y = row * TS;
  ctx.fillStyle = '#3a6830';
  ctx.fillRect(x, y, TS, TS);
  ctx.fillStyle = '#7a4a20';
  ctx.fillRect(x + 6, y + 10, 4, 6);
  ctx.fillStyle = '#2a5c1e';
  ctx.beginPath();
  ctx.arc(x + 8, y + 7, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d8c28';
  ctx.beginPath();
  ctx.arc(x + 7, y + 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5ab838';
  ctx.fillRect(x + 5, y + 3, 3, 2);
  ctx.fillRect(x + 9, y + 4, 2, 2);
}

// ---- Building drawing ------------------------------------------------

function drawGallery(ctx, x, y, w, h) {
  // Roof
  ctx.fillStyle = '#7a1800';
  ctx.fillRect(x, y, w, 13);
  ctx.fillStyle = '#6a1000';
  for (let i = 0; i < w; i += 6) ctx.fillRect(x + i, y, 5, 4);
  ctx.fillStyle = '#9a2a00';
  ctx.fillRect(x, y + 11, w, 2); // eave

  // Brick walls
  ctx.fillStyle = '#c84820';
  ctx.fillRect(x, y + 13, w, h - 13);
  ctx.fillStyle = '#a03410';
  for (let r = 0; r < 5; r++) {
    ctx.fillRect(x, y + 13 + r * 10, w, 1);
    const off = r % 2 === 0 ? 0 : 10;
    for (let c = off; c < w; c += 20) ctx.fillRect(x + c, y + 14 + r * 10, 1, 9);
  }

  // Windows — gold frame + blue glass
  const winY = y + 17;
  [[x + 8, winY, 22, 18], [x + 50, winY, 22, 18]].forEach(([wx, wy, ww, wh]) => {
    ctx.fillStyle = '#7a5200';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = '#7ab8d8';
    ctx.fillRect(wx + 2, wy + 2, 8, wh - 4);
    ctx.fillRect(wx + 12, wy + 2, 8, wh - 4);
    ctx.fillStyle = '#7a5200';
    ctx.fillRect(wx + 11, wy, 1, wh);     // vertical divider
    ctx.fillRect(wx, wy + 9, ww, 1);      // horizontal divider
  });

  // Sign plaque
  ctx.fillStyle = '#5a3000';
  ctx.fillRect(x + 12, y + 39, 56, 10);
  ctx.fillStyle = '#d4a030';
  ctx.fillRect(x + 13, y + 40, 54, 8);
  ctx.fillStyle = '#2a1000';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ART GALLERY', x + w / 2, y + 47);

  // Door
  ctx.fillStyle = '#3a2000';
  ctx.fillRect(x + 31, y + 51, 18, 13);
  ctx.fillStyle = '#5a3820';
  ctx.fillRect(x + 33, y + 53, 14, 11);
  ctx.fillStyle = '#d4a030';
  ctx.fillRect(x + 44, y + 58, 2, 2);
}

function drawNewsagency(ctx, x, y, w, h) {
  // Roof
  ctx.fillStyle = '#0a1840';
  ctx.fillRect(x, y, w, 13);
  ctx.fillStyle = '#0a2060';
  ctx.fillRect(x, y + 11, w, 2);

  // Walls
  ctx.fillStyle = '#1a2a6e';
  ctx.fillRect(x, y + 13, w, h - 13);

  // Striped awning
  const awnY = y + 21;
  for (let i = 0; i < w; i += 8) {
    ctx.fillStyle = (Math.floor(i / 8) % 2 === 0) ? '#ffffff' : '#2244cc';
    ctx.fillRect(x + i, awnY, 8, 7);
  }
  ctx.fillStyle = '#0a1a4e';
  ctx.fillRect(x, awnY + 7, w, 1);

  // Windows
  const nwy = y + 31;
  [[x + 10, nwy, 20, 14], [x + 50, nwy, 20, 14]].forEach(([wx, wy, ww, wh]) => {
    ctx.fillStyle = '#0a1040';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = '#88bbcc';
    ctx.fillRect(wx + 2, wy + 2, 7, wh - 4);
    ctx.fillRect(wx + 11, wy + 2, 7, wh - 4);
    ctx.fillStyle = '#0a1040';
    ctx.fillRect(wx + 10, wy, 1, wh);
  });

  // Sign
  ctx.fillStyle = '#cc1111';
  ctx.fillRect(x + 10, y + 48, 60, 10);
  ctx.fillStyle = '#ffffff';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NEWSAGENCY', x + w / 2, y + 56);

  // Door
  ctx.fillStyle = '#0a1040';
  ctx.fillRect(x + 32, y + 51, 16, 13);
  ctx.fillStyle = '#3060aa';
  ctx.fillRect(x + 34, y + 53, 12, 11);
  ctx.fillStyle = '#aaccee';
  ctx.fillRect(x + 36, y + 55, 4, 7);
}

function drawNoticeboard(ctx, x, y, w, h) {
  // Roof
  ctx.fillStyle = '#4a2e10';
  ctx.fillRect(x, y, w, 13);
  ctx.fillStyle = '#6a4820';
  ctx.fillRect(x, y + 11, w, 2);

  // Wooden plank walls
  ctx.fillStyle = '#6e4220';
  ctx.fillRect(x, y + 13, w, h - 13);
  ctx.fillStyle = '#5a3418';
  for (let p = 0; p < 9; p++) ctx.fillRect(x, y + 13 + p * 6, w, 1);
  ctx.fillStyle = '#7e5230';
  for (let p = 0; p < 9; p += 2) ctx.fillRect(x + 1, y + 14 + p * 6, w - 2, 2);

  // Corkboard
  ctx.fillStyle = '#9a7238';
  ctx.fillRect(x + 6, y + 17, w - 12, 30);
  ctx.fillStyle = '#b08848';
  ctx.fillRect(x + 8, y + 19, w - 16, 26);
  // Corner pins
  ctx.fillStyle = '#cc3333';
  [[x + 9, y + 20], [x + w - 12, y + 20], [x + 9, y + 42], [x + w - 12, y + 42]]
    .forEach(([px, py]) => ctx.fillRect(px, py, 3, 3));
  // Paper lines
  ctx.fillStyle = '#8a6830';
  for (let li = 0; li < 3; li++) ctx.fillRect(x + 13, y + 25 + li * 6, w - 26, 2);
  // Label
  ctx.fillStyle = '#2a1800';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ABOUT', x + w / 2, y + 40);

  // Door
  ctx.fillStyle = '#3a2000';
  ctx.fillRect(x + 30, y + 50, 20, 14);
  ctx.fillStyle = '#5a3820';
  ctx.fillRect(x + 32, y + 52, 16, 12);
  ctx.fillStyle = '#3a2000';
  ctx.fillRect(x + 30, y + 57, 20, 1);
  ctx.fillRect(x + 30, y + 61, 20, 1);
  ctx.fillStyle = '#c89030';
  ctx.fillRect(x + 46, y + 58, 2, 2);
}

function drawPostOffice(ctx, x, y, w, h) {
  // Roof
  ctx.fillStyle = '#1a4020';
  ctx.fillRect(x, y, w, 13);
  ctx.fillStyle = '#1a5028';
  ctx.fillRect(x, y + 11, w, 2);

  // Walls — green stone
  ctx.fillStyle = '#287a30';
  ctx.fillRect(x, y + 13, w, h - 13);
  ctx.fillStyle = '#208028';
  for (let r = 0; r < 5; r++) {
    ctx.fillRect(x, y + 13 + r * 10, w, 1);
    const off = r % 2 === 0 ? 0 : 10;
    for (let c = off; c < w; c += 20) ctx.fillRect(x + c, y + 14 + r * 10, 1, 9);
  }

  // Royal seal
  ctx.fillStyle = '#c8a020';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 26, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#287a30';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 26, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x + w / 2 - 3, y + 22, 6, 1);
  ctx.fillRect(x + w / 2 - 3, y + 30, 6, 1);

  // Sign
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 8, y + 37, 64, 10);
  ctx.fillStyle = '#1a4020';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('POST OFFICE', x + w / 2, y + 45);

  // Door
  ctx.fillStyle = '#1a4020';
  ctx.fillRect(x + 31, y + 50, 18, 14);
  ctx.fillStyle = '#1a6028';
  ctx.fillRect(x + 33, y + 52, 14, 12);
  ctx.fillStyle = '#0a2010';
  ctx.fillRect(x + 35, y + 59, 10, 3); // mail slot
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x + 46, y + 55, 2, 2);
}

function drawMonument(ctx, x, y, w, h) {
  // Base platform
  ctx.fillStyle = '#777';
  ctx.fillRect(x, y + h - 8, w, 8);
  ctx.fillStyle = '#999';
  ctx.fillRect(x, y + h - 8, w, 2);

  // Left column
  ctx.fillStyle = '#aaa';
  ctx.fillRect(x + 4, y + 4, 8, h - 12);
  ctx.fillStyle = '#bbb';
  ctx.fillRect(x + 4, y + 4, 2, h - 12);
  ctx.fillStyle = '#888';
  ctx.fillRect(x + 10, y + 4, 2, h - 12);
  // Column caps
  ctx.fillStyle = '#ccc';
  ctx.fillRect(x + 2, y + 4, 12, 4);
  ctx.fillRect(x + 2, y + h - 12, 12, 4);

  // Right column
  ctx.fillStyle = '#aaa';
  ctx.fillRect(x + w - 12, y + 4, 8, h - 12);
  ctx.fillStyle = '#bbb';
  ctx.fillRect(x + w - 12, y + 4, 2, h - 12);
  ctx.fillStyle = '#888';
  ctx.fillRect(x + w - 4, y + 4, 2, h - 12);
  ctx.fillStyle = '#ccc';
  ctx.fillRect(x + w - 14, y + 4, 12, 4);
  ctx.fillRect(x + w - 14, y + h - 12, 12, 4);

  // Top lintel
  ctx.fillStyle = '#999';
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = '#bbb';
  ctx.fillRect(x, y, w, 2);

  // Plaque
  ctx.fillStyle = '#888';
  ctx.fillRect(x + 14, y + 8, w - 28, h - 22);
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(x + 15, y + 9, w - 30, h - 24);
  ctx.fillStyle = '#666';
  for (let li = 0; li < 5; li++) ctx.fillRect(x + 18, y + 13 + li * 5, w - 36, 2);
  ctx.fillStyle = '#444';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RESUME', x + w / 2, y + 16);
}

// ---- Main draw -------------------------------------------------------

function drawWorld(ctx) {
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      switch (TILEMAP[row][col]) {
        case T.GRASS: drawGrassTile(ctx, col, row); break;
        case T.PATH:  drawPathTile(ctx, col, row);  break;
        case T.TREE:  drawTreeTile(ctx, col, row);  break;
        default:
          ctx.fillStyle = '#2a6b9e';
          ctx.fillRect(col * TS, row * TS, TS, TS);
      }
    }
  }

  for (const b of BUILDINGS) {
    ctx.save();
    const x = b.tx * TS, y = b.ty * TS, w = b.tw * TS, h = b.th * TS;
    switch (b.id) {
      case 'gallery':  drawGallery(ctx, x, y, w, h);     break;
      case 'news':     drawNewsagency(ctx, x, y, w, h);  break;
      case 'notice':   drawNoticeboard(ctx, x, y, w, h); break;
      case 'post':     drawPostOffice(ctx, x, y, w, h);  break;
      case 'monument': drawMonument(ctx, x, y, w, h);    break;
    }
    ctx.restore();
  }
}
