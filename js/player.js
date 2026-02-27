// ============================================================
// PLAYER — position, movement, animation
// ============================================================

const PLAYER_SPEED = 2;

const Player = {
  x: 14 * TILE_SIZE,
  y: 8  * TILE_SIZE,
  targetX: null,
  targetY: null,
  facing: 'down',

  // 4-frame walk cycle: 0=idle, 1=left-step, 2=idle, 3=right-step
  frame: 0,
  frameTimer: 0,
  FRAME_INTERVAL: 10,

  w: TILE_SIZE,
  h: TILE_SIZE,

  keys: { up: false, down: false, left: false, right: false },

  reset() {
    this.x = 14 * TILE_SIZE;
    this.y = 8  * TILE_SIZE;
    this.targetX = null;
    this.targetY = null;
    this.facing = 'down';
  },

  tileCol() { return Math.floor((this.x + this.w / 2) / TILE_SIZE); },
  tileRow() { return Math.floor((this.y + this.h / 2) / TILE_SIZE); },

  setMoveTarget(worldX, worldY) { this.targetX = worldX; this.targetY = worldY; },
  clearTarget()                  { this.targetX = null;   this.targetY = null;   },

  update() {
    let dx = 0, dy = 0;

    if (this.keys.left)  dx = -PLAYER_SPEED;
    if (this.keys.right) dx =  PLAYER_SPEED;
    if (this.keys.up)    dy = -PLAYER_SPEED;
    if (this.keys.down)  dy =  PLAYER_SPEED;

    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

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

    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? 'right' : 'left';
    } else if (dy !== 0) {
      this.facing = dy > 0 ? 'down' : 'up';
    }

    if (dx !== 0) {
      const nx  = this.x + dx;
      const col = Math.floor((nx + (dx > 0 ? this.w : 0)) / TILE_SIZE);
      if (!isTileBlocked(col, this.tileRow())) { this.x = nx; } else { this.clearTarget(); dx = 0; }
    }
    if (dy !== 0) {
      const ny  = this.y + dy;
      const row = Math.floor((ny + (dy > 0 ? this.h : 0)) / TILE_SIZE);
      if (!isTileBlocked(this.tileCol(), row)) { this.y = ny; } else { this.clearTarget(); dy = 0; }
    }

    this.x = Math.max(0, Math.min(this.x, (WORLD_COLS - 1) * TILE_SIZE));
    this.y = Math.max(0, Math.min(this.y, (WORLD_ROWS - 1) * TILE_SIZE));

    if (moving) {
      this.frameTimer++;
      if (this.frameTimer >= this.FRAME_INTERVAL) {
        this.frame = (this.frame + 1) % 4;
        this.frameTimer = 0;
      }
    } else {
      this.frame = 0;
      this.frameTimer = 0;
    }
  },

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);

    // Walk offsets — legs alternate y by 1px, opposite legs
    const lly = this.frame === 1 ?  1 : this.frame === 3 ? -1 : 0; // left  leg
    const rly = this.frame === 1 ? -1 : this.frame === 3 ?  1 : 0; // right leg

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 15, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (shirt)
    ctx.fillStyle = '#2255bb';
    ctx.fillRect(x + 4, y + 7, 8, 5);

    // Arms
    ctx.fillStyle = '#2255bb';
    ctx.fillRect(x + 2, y + 7, 2, 4);
    ctx.fillRect(x + 12, y + 7, 2, 4);
    // Hands
    ctx.fillStyle = '#f5c08a';
    ctx.fillRect(x + 2, y + 11, 2, 2);
    ctx.fillRect(x + 12, y + 11, 2, 2);

    // Legs
    ctx.fillStyle = '#334466';
    ctx.fillRect(x + 5, y + 12 + lly, 3, 3);
    ctx.fillRect(x + 8, y + 12 + rly, 3, 3);

    // Shoes
    ctx.fillStyle = '#221100';
    if (this.frame === 0 || this.frame === 2) {
      ctx.fillRect(x + 4, y + 15, 4, 1);
      ctx.fillRect(x + 8, y + 15, 4, 1);
    } else if (this.frame === 1) {
      ctx.fillRect(x + 3, y + 15, 4, 1); // left forward
      ctx.fillRect(x + 8, y + 14, 4, 1); // right back
    } else {
      ctx.fillRect(x + 4, y + 14, 4, 1); // left back
      ctx.fillRect(x + 9, y + 15, 4, 1); // right forward
    }

    // Head
    if (this.facing === 'up') {
      // Back of head — just hair
      ctx.fillStyle = '#5c3317';
      ctx.fillRect(x + 5, y + 1, 6, 6);
      ctx.fillStyle = '#4a2810';
      ctx.fillRect(x + 4, y + 4, 1, 3);
      ctx.fillRect(x + 11, y + 4, 1, 3);
    } else {
      // Face
      ctx.fillStyle = '#f5c08a';
      ctx.fillRect(x + 5, y + 2, 6, 5);
      // Hair
      ctx.fillStyle = '#5c3317';
      ctx.fillRect(x + 5, y + 1, 6, 3);
      ctx.fillRect(x + 4, y + 2, 1, 4);
      ctx.fillRect(x + 11, y + 2, 1, 4);

      // Eyes
      ctx.fillStyle = '#1a1a1a';
      if (this.facing === 'down') {
        ctx.fillRect(x + 6, y + 4, 1, 1);
        ctx.fillRect(x + 9, y + 4, 1, 1);
      } else if (this.facing === 'right') {
        ctx.fillRect(x + 9, y + 4, 1, 1);
        ctx.fillStyle = '#5c3317';
        ctx.fillRect(x + 9, y + 3, 2, 1); // brow
      } else {
        ctx.fillRect(x + 6, y + 4, 1, 1);
        ctx.fillStyle = '#5c3317';
        ctx.fillRect(x + 5, y + 3, 2, 1); // brow
      }
    }
  },
};
