# Scott's Portfolio — Build Checklist

## File Map
- `docs/initial_brief.md` — original client brief
- `docs/conversation_log.md` — auto-logged conversation
- `docs/TODO.md` — this file
- `.claude/settings.json` — project hooks config
- `.claude/log_user.sh` / `log_claude.sh` — conversation logging scripts

---

## Phase 1 — Greybox (mechanics + content wired up, placeholder art)

### Project scaffold
- [x] `index.html` — shell, canvas element, all 5 panel divs
- [x] `style.css` — base reset, canvas scaling, pixel font, panel layouts
- [x] `js/world.js` — tilemap data, building definitions, collision map
- [x] `js/player.js` — character position, movement, animation state
- [x] `js/game.js` — main loop, input handling, canvas render, state machine

### Overworld
- [x] Canvas renders greybox tilemap (grass, paths, trees as coloured rects)
- [x] 5 buildings rendered as labelled coloured rectangles
- [x] Player character renders (pixel-art style with directional eyes + walk anim)
- [x] WASD / arrow key movement works
- [x] Collision detection (player can't walk through buildings)
- [x] Click-to-move works (desktop)
- [x] Touch-to-move works (mobile)
- [x] Building interaction trigger (Space/Enter when adjacent, or click/tap building)
- [x] Canvas scales responsively to any viewport (CSS, no JS resize)

### Interior panels (HTML/CSS)
- [x] Panel open/close transitions (canvas fades out, panel fades in)
- [x] ESC key + on-screen Exit button closes panel
- [x] **Gallery panel** — art gallery room, project cards as framed pictures
- [x] **Newsagency panel** — newspaper wall, media items as front pages
- [x] **Notice Board panel** — cork board, about me as pinned notes
- [x] **Post Office panel** — counter, contact form with obfuscated email
- [x] **Monument panel** — stone plaque, career timeline / resume

### Content (placeholder text OK for now)
- [x] Populate Gallery with Scott's real projects (from scott.purcival.com)
- [x] Populate Newsagency with media items
- [x] Populate Notice Board with bio
- [x] Contact form wired up (mailto, email obfuscated)
- [x] Monument with career timeline

---

## Phase 2 — Art pass
- [ ] Source CC0 tilesets from Kenney.nl (Tiny Town / Tiny Dungeon)
- [ ] Replace greybox tiles with sprite sheet rendering
- [ ] Player walking animation (4-directional sprite frames)
- [ ] Building sprites
- [ ] Interior room backgrounds per panel
- [ ] Pixel font polish on all panels

## Phase 3 — Polish
- [ ] Page `<title>`, meta description, Open Graph tags
- [ ] Favicon (pixel art)
- [ ] Entrance/exit transition effects
- [ ] Optional: ambient sound toggle
- [ ] Cross-browser/device QA
- [ ] Deploy
