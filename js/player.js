// ============================================================
// PLAYER — position, movement, animation
// ============================================================

const PLAYER_SPEED = 2; // pixels per frame at 60fps

const Player = {
  // Position in world pixels (top-left of sprite)
  x: 14 * TILE_SIZE,
  y: 8  * TILE_SIZE,

  // Movement target (click/touch destination in world px)
  targetX: null,
  targetY: null,

  // Direction for sprite: 'down','up','left','right'
  facing: 'down',

  // Animation frame (0 or 1, toggled every N frames)
  frame: 0,
  frameTimer: 0,
  FRAME_INTERVAL: 12, // frames between animation step

  // Sprite size matches tile size
  w: TILE_SIZE,
  h: TILE_SIZE,

  // Keyboard state
  keys: { up: false, down: false, left: false, right: false },

  reset() {
    this.x = 14 * TILE_SIZE;
    this.y = 8  * TILE_SIZE;
    this.targetX = null;
    this.targetY = null;
    this.facing = 'down';
  },

  // Returns tile coords of player's centre
  tileCol() { return Math.floor((this.x + this.w / 2) / TILE_SIZE); },
  tileRow() { return Math.floor((this.y + this.h / 2) / TILE_SIZE); },

  setMoveTarget(worldX, worldY) {
    this.targetX = worldX;
    this.targetY = worldY;
  },

  clearTarget() {
    this.targetX = null;
    this.targetY = null;
  },

  update() {
    let dx = 0, dy = 0;

    // --- Keyboard movement takes priority ---
    if (this.keys.left)  dx = -PLAYER_SPEED;
    if (this.keys.right) dx =  PLAYER_SPEED;
    if (this.keys.up)    dy = -PLAYER_SPEED;
    if (this.keys.down)  dy =  PLAYER_SPEED;

    // Normalise diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    // --- Click/touch target movement ---
    if (dx === 0 && dy === 0 && this.targetX !== null) {
      const diffX = this.targetX - (this.x + this.w / 2);
      const diffY = this.targetY - (this.y + this.h / 2);
      const dist  = Math.sqrt(diffX * diffX + diffY * diffY);

      if (dist < PLAYER_SPEED + 1) {
        this.clearTarget();
      } else {
        dx = (diffX / dist) * PLAYER_SPEED;
        dy = (diffY / dist) * PLAYER_SPEED;
      }
    }

    const moving = dx !== 0 || dy !== 0;

    // Update facing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? 'right' : 'left';
    } else if (dy !== 0) {
      this.facing = dy > 0 ? 'down' : 'up';
    }

    // Collision — try each axis independently
    if (dx !== 0) {
      const nx = this.x + dx;
      const col = Math.floor((nx + (dx > 0 ? this.w : 0)) / TILE_SIZE);
      const row = this.tileRow();
      if (!isTileBlocked(col, row)) {
        this.x = nx;
      } else {
        this.clearTarget();
        dx = 0;
      }
    }
    if (dy !== 0) {
      const ny = this.y + dy;
      const col = this.tileCol();
      const row = Math.floor((ny + (dy > 0 ? this.h : 0)) / TILE_SIZE);
      if (!isTileBlocked(col, row)) {
        this.y = ny;
      } else {
        this.clearTarget();
        dy = 0;
      }
    }

    // Clamp to world bounds
    this.x = Math.max(0, Math.min(this.x, (WORLD_COLS - 1) * TILE_SIZE));
    this.y = Math.max(0, Math.min(this.y, (WORLD_ROWS - 1) * TILE_SIZE));

    // Animate walk cycle
    if (moving) {
      this.frameTimer++;
      if (this.frameTimer >= this.FRAME_INTERVAL) {
        this.frame = 1 - this.frame;
        this.frameTimer = 0;
      }
    } else {
      this.frame = 0;
      this.frameTimer = 0;
    }
  },

  draw(ctx) {
    const x = this.x;
    const y = this.y;
    const w = this.w;
    const h = this.h;

    // Body — dark blue shirt
    ctx.fillStyle = '#2244aa';
    ctx.fillRect(x + 3, y + 5, w - 6, h - 5);

    // Head — skin tone
    ctx.fillStyle = '#f5c59f';
    ctx.fillRect(x + 4, y, w - 8, 7);

    // Hair — dark brown
    ctx.fillStyle = '#3b1f07';
    ctx.fillRect(x + 4, y, w - 8, 3);

    // Eyes — direction indicator
    ctx.fillStyle = '#000';
    if (this.facing === 'down') {
      ctx.fillRect(x + 5, y + 4, 2, 2);
      ctx.fillRect(x + 9, y + 4, 2, 2);
    } else if (this.facing === 'up') {
      ctx.fillRect(x + 5, y + 2, 2, 2);
      ctx.fillRect(x + 9, y + 2, 2, 2);
    } else if (this.facing === 'right') {
      ctx.fillRect(x + 10, y + 3, 2, 2);
    } else {
      ctx.fillRect(x + 4, y + 3, 2, 2);
    }

    // Legs — walk animation
    ctx.fillStyle = '#334';
    if (this.frame === 0) {
      ctx.fillRect(x + 4, y + h - 5, 3, 5);
      ctx.fillRect(x + 9, y + h - 5, 3, 5);
    } else {
      ctx.fillRect(x + 3, y + h - 6, 3, 6);
      ctx.fillRect(x + 10, y + h - 4, 3, 4);
    }
  },
};
