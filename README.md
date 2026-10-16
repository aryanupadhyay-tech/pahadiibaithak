# Pahadi Baithak — by Team Baithak Ho Jaye

This is the pitch website for **Pahadi Baithak**, our entry to **GNIOT INNOVEX 2026** (Think • Innovate • Impact). Pahadi Baithak is a high-altitude food franchise for trekkers on Himalayan routes, starting with Hampta Pass in Himachal Pradesh. It has four parts:

- Dehydrated, self-heating Indian meals served with edible millet bowls
- Solar-powered **Stall-in-a-Box** kiosks run by local villagers, who open a stall without paying anything up front
- Cruelty-free logistics: local porters, gravity ropeways and, later, cargo drones. No pack animals.
- A ₹50 **Bring-It-Back** wrapper deposit, a Trekker's Passport loyalty card, and stalls that double as offline check-in and SOS points

The site includes interactive demos of the idea: a trail menu, a weight-savings calculator, a deposit and passport simulator, a safety checkpoint map, a demand-forecast model and a mock WhatsApp-bot prototype. It ends with a "Back the Baithak" interest form that runs on Netlify Forms.

## Tech
- Plain HTML, CSS and vanilla JavaScript (`index.html`, `styles.css`, `app.js`), with no build step
- Netlify Forms for the interest form
- Netlify Image CDN for the AI-generated imagery in `img/`

## Run locally
```bash
netlify dev --port 8889
```
You can also open `index.html` through any static file server. To test form submissions, use Netlify Dev or a deploy.
