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

## Current phase: Phase 1 — Greybox

All game mechanics and content are wired up. Buildings, movement, collision, and all five interior panels work. Art is placeholder (coloured rectangles and text labels).

**Phase 2** (next): replace placeholder art with CC0 pixel sprites (Kenney.nl), add a proper walking animation, and polish the interior room backgrounds.

**Phase 3** (later): sound, transitions, SEO meta tags, favicon, cross-device QA, deploy.

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
