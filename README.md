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

## Current phase: Phase 3 — Polish ✓

The site is production-ready.

- Meta description, Open Graph, and Twitter Card tags for social sharing
- Pixel art SVG favicon
- Cinema-bar wipe transition when entering and exiting buildings
- Interaction hint shows the building name in gold when the player is nearby
- Cross-browser rendering: `image-rendering` stack covers Chrome, Firefox, Safari, and Edge
- Mobile: `touch-action: none` prevents scroll interference, safe-area padding handles iPhone notch
- Canvas has `role`, `aria-label`, and `tabindex` for keyboard and screen-reader accessibility
- `.nojekyll` included for GitHub Pages deployment

**To deploy:** push to a GitHub repository and enable GitHub Pages (set source to `main` branch, root folder). No build step required — the site is static HTML.

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
