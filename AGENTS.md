# AGENTS.md

This is a static, single-page pitch site for Pahadi Baithak (Team Baithak Ho Jaye, GNIOT INNOVEX 2026 ideathon). There is no framework and no build step. `netlify.toml` publishes the repo root.

## Files
- `index.html`: all sections, in order: hero, problem, menu, stall, logistics, loop (deposit + passport), safety map, forecast, prototype (WhatsApp bot), franchise, impact, roadmap, join form.
- `styles.css`: design tokens are CSS variables in `:root` (paper/pine/saffron palette; Young Serif display font, Familjen Grotesk body font, DM Mono for labels). Breakpoints are at 980px and 600px.
- `app.js`: every interactive widget. All demo content (menu, routes, stations, margins) lives in the `DATA` object at the top, so edit there rather than in the markup.
- `img/`: AI-generated source PNGs. Always reference them through `/.netlify/images?url=/img/<file>&w=<w>&fm=webp`, never directly.

## Conventions and notes
- The join form is a Netlify Form named `back-the-baithak`, submitted by AJAX to `/`. If you add fields, add them to the static HTML form too.
- The fixed altimeter maps scroll progress to the trail's altitude profile (`altStops` in `app.js`).
- Figures such as prices, the revenue split and the forecast formula are illustrative pitch numbers. Keep them consistent with the ₹50 deposit and the 90% weight-reduction claim in the team's idea document.
- The UI copy deliberately contains no emoji. Icons are inline SVG.
