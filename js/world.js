// ============================================================
// WORLD — tilemap, buildings, collision
// ============================================================

// Tile types
const T = {
  GRASS: 0,
  PATH:  1,
  TREE:  2,
  WATER: 3,
};

// Tile render colours (greybox)
const TILE_COLOURS = {
  [T.GRASS]: '#4a7c3f',
  [T.PATH]:  '#b5935a',
  [T.TREE]:  '#2d5a1b',
  [T.WATER]: '#2a6b9e',
};

// World dimensions in tiles
const WORLD_COLS = 30;
const WORLD_ROWS = 17;
const TILE_SIZE  = 16; // internal px

// Tilemap — 17 rows × 30 cols
// 0=grass, 1=path, 2=tree, 3=water
const TILEMAP = [
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0],
  [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
];

// Buildings — tile coords (tx,ty) = top-left corner, size in tiles
// 'panel' matches the panel div id suffix
const BUILDINGS = [
  {
    id:    'gallery',
    label: 'Art Gallery',
    panel: 'gallery',
    tx: 2,  ty: 1,   // top-left tile
    tw: 5,  th: 4,   // width/height in tiles
    colour:    '#7b3f00',
    roofColour:'#a0522d',
    doorTile:  { tx: 4, ty: 4 }, // tile player must reach to enter
  },
  {
    id:    'news',
    label: 'Newsagency',
    panel: 'news',
    tx: 20, ty: 1,
    tw: 5,  th: 4,
    colour:    '#00356b',
    roofColour:'#0055a5',
    doorTile:  { tx: 22, ty: 5 },
  },
  {
    id:    'notice',
    label: 'Notice Board',
    panel: 'notice',
    tx: 2,  ty: 10,
    tw: 5,  th: 4,
    colour:    '#4a3000',
    roofColour:'#8b6914',
    doorTile:  { tx: 4, ty: 14 },
  },
  {
    id:    'post',
    label: 'Post Office',
    panel: 'post',
    tx: 20, ty: 10,
    tw: 5,  th: 4,
    colour:    '#1a3a1a',
    roofColour:'#2d6b2d',
    doorTile:  { tx: 22, ty: 14 },
  },
  {
    id:    'monument',
    label: 'Monument',
    panel: 'monument',
    tx: 13, ty: 5,
    tw: 4,  th: 3,
    colour:    '#666',
    roofColour:'#999',
    doorTile:  { tx: 14, ty: 8 },
  },
];

// Build a fast collision lookup: Set of "col,row" strings
function buildCollisionMap() {
  const blocked = new Set();

  // Block tree tiles
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      if (TILEMAP[row][col] === T.TREE || TILEMAP[row][col] === T.WATER) {
        blocked.add(`${col},${row}`);
      }
    }
  }

  // Block building tiles (except door tile)
  for (const b of BUILDINGS) {
    for (let r = b.ty; r < b.ty + b.th; r++) {
      for (let c = b.tx; c < b.tx + b.tw; c++) {
        blocked.add(`${c},${r}`);
      }
    }
  }

  return blocked;
}

const COLLISION_MAP = buildCollisionMap();

function isTileBlocked(col, row) {
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return true;
  return COLLISION_MAP.has(`${col},${row}`);
}

// Return building whose door tile matches, or null
function getBuildingAtDoor(col, row) {
  return BUILDINGS.find(b => b.doorTile.tx === col && b.doorTile.ty === row) || null;
}

// Draw the world onto a canvas context
function drawWorld(ctx) {
  // Tiles
  for (let row = 0; row < WORLD_ROWS; row++) {
    for (let col = 0; col < WORLD_COLS; col++) {
      const type = TILEMAP[row][col];
      ctx.fillStyle = TILE_COLOURS[type] || '#000';
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      // Tree: draw a darker circle on top
      if (type === T.TREE) {
        ctx.fillStyle = '#1a3d0e';
        ctx.beginPath();
        ctx.arc(
          col * TILE_SIZE + TILE_SIZE / 2,
          row * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE / 2 - 1, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // Buildings
  for (const b of BUILDINGS) {
    const x = b.tx * TILE_SIZE;
    const y = b.ty * TILE_SIZE;
    const w = b.tw * TILE_SIZE;
    const h = b.th * TILE_SIZE;
    const roofH = TILE_SIZE;

    // Body
    ctx.fillStyle = b.colour;
    ctx.fillRect(x, y + roofH, w, h - roofH);

    // Roof
    ctx.fillStyle = b.roofColour;
    ctx.fillRect(x, y, w, roofH);

    // Door (dark rect at bottom centre)
    const doorW = TILE_SIZE;
    const doorH = TILE_SIZE;
    ctx.fillStyle = '#111';
    ctx.fillRect(x + w / 2 - doorW / 2, y + h - doorH, doorW, doorH);

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, x + w / 2, y + roofH - 2);
  }
}
