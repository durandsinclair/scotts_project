# Scott Purcival — Portfolio

A top-down pixel art game world as a portfolio website. Explore a small village where each building holds a section of Scott's work.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step.

---

## How to run

1. Clone or download this repository
2. Open `index.html` in any modern browser

That's it. No install, no server required.

---

## Controls

| Input | Action |
|---|---|
| WASD / Arrow keys | Move |
| Click / Tap | Walk to that spot |
| Click / Tap a building | Walk to it and enter |
| Space or Enter | Enter nearest building |
| ESC | Exit a building |

---

## Buildings

| Building | Contents |
|---|---|
| Art Gallery | Portfolio — shipped projects |
| Newsagency | Media — features and releases |
| Notice Board | About — bio and links |
| Post Office | Contact — send a message |
| Monument | Resume — career timeline |

---

## Current phase: Phase 2 — Art pass ✓

All game mechanics, content, and art are complete.

- Grass, cobblestone paths, and layered trees drawn programmatically
- Five unique building facades: terracotta gallery, navy newsagency, wood notice board, green post office, stone monument with columns
- Player character with 4-frame directional walk cycle and ground shadow
- Interior rooms styled as distinct environments: gallery with wallpaper and parquet floor, newsagency with aged newspaper props, notice board set outdoors with sky and grass, post office with wooden counter, monument with stone-gradient plaque

**Phase 3** (next): SEO meta tags, favicon, entrance/exit transitions, cross-device QA, deploy.

---

## Project structure

```
scotts_portfolio/
├── index.html          — page shell, canvas, all panel HTML
├── style.css           — pixel aesthetic, layouts, responsive scaling
├── js/
│   ├── game.js         — main loop, input, state machine, panels
│   ├── world.js        — tilemap, buildings, collision
│   └── player.js       — character movement and drawing
├── docs/
│   ├── TODO.md         — build checklist
│   ├── initial_brief.md— original client brief
│   └── conversation_log.md — auto-logged dev conversation
└── README.md
```
