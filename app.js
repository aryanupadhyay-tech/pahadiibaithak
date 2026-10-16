// Pahadi Baithak — interactive pitch site
// All demo data lives in the DATA block below so it can be swapped for live data later.

const DATA = {
  menu: [
    { id: 'rajma', name: 'Rajma Chawal', tag: 'Bestseller', meta: 'Freeze-dried · self-heating', price: 149, kcal: 540, protein: 19, weight: 140,
      desc: 'Slow-cooked Himachali rajma with long-grain rice. It\'s our heaviest-hitting meal after a long climb.' },
    { id: 'khichdi', name: 'Moong Dal Khichdi', tag: 'Easy on altitude stomachs', meta: 'Dehydrated · ghee sachet', price: 129, kcal: 470, protein: 17, weight: 125,
      desc: 'A light, warming khichdi with turmeric and jeera. It\'s gentle on the stomach above 3,500 m and comes in an edible millet bowl.' },
    { id: 'thukpa', name: 'Soya Thukpa Broth', tag: 'High protein', meta: 'Instant · 400 ml broth', price: 139, kcal: 410, protein: 26, weight: 110,
      desc: 'A Lahauli-style noodle broth with soya chunks, garlic and timut pepper. It\'s salty and hot, which helps against altitude dehydration.' },
    { id: 'oats', name: 'Masala Oats & Nuts', tag: 'Sunrise summit pack', meta: 'Instant · walnuts, jaggery', price: 99, kcal: 390, protein: 14, weight: 95,
      desc: 'Savoury oats with walnuts, peanuts and a jaggery bite, ready before the 4 a.m. pass crossing.' },
  ],
  routes: [
    { name: 'Local porters', reach: 'Manali → Balu ka Ghera', path: 'M30 240 L110 175 L190 160 L290 115',
      body: 'Young people from nearby villages carry 10–15 kg backpacks for the last stretch. The meals are so light that it\'s comfortable work, and the porters are paid fairly.',
      kv: [['Load per trip', '12 kg'], ['Meals per trip', '~95'], ['Who earns', 'Local youth'], ['Live from', 'Phase 1']] },
    { name: 'Gravity ropeway', reach: 'Jobra → Chika valley', path: 'M110 175 L190 160',
      body: 'This copies the zip-lines Himachal apple farmers use to send crates down slopes. Our ropeways are temporary, run on manual pulleys or solar power, and come down at the end of the season.',
      kv: [['Load per run', '30 kg'], ['Power', 'Solar / manual'], ['Setup', 'Seasonal, removable'], ['Live from', 'Phase 1 (basic)']] },
    { name: 'Cargo drone', reach: 'Base camp → Hampta Pass', path: 'M30 240 Q 220 20 400 45',
      body: 'Heavy-payload drones drop meal pouches and medical kits straight to the high stalls, so we can restock fast before a storm closes the pass.',
      kv: [['Payload', '15–20 kg'], ['Flight time', '~14 min'], ['Use case', 'Storm restock, medical'], ['Live from', 'Phase 3']] },
  ],
  stations: [
    { id: 'jobra', name: 'Jobra', alt: 3000, x: 110, y: 330, trekkers: 47, meals: 162, wrappers: 38, solar: 91,
      note: 'The first stall above the road head. Trekkers pick up their Passport here and pre-book meals on WhatsApp while they still have signal.' },
    { id: 'chika', name: 'Chika', alt: 3100, x: 175, y: 290, trekkers: 39, meals: 141, wrappers: 44, solar: 86,
      note: 'A riverside camp. The gravity ropeway from Jobra ends here, and it\'s the busiest wrapper-return point on day 1.' },
    { id: 'balu', name: 'Balu ka Ghera', alt: 3600, x: 260, y: 230, trekkers: 33, meals: 118, wrappers: 61, solar: 82,
      note: 'The last camp before the pass. Everyone has to check in here before the crossing, and the SOS beacon reaches Manali base camp.' },
    { id: 'pass', name: 'Hampta Pass', alt: 4270, x: 350, y: 120, trekkers: 21, meals: 64, wrappers: 17, solar: 74,
      note: 'Our highest stall. It sells hot chai and broth only and opens 5 a.m. to 2 p.m. Supplies come by drone in Phase 3.' },
    { id: 'shea', name: 'Shea Goru', alt: 3900, x: 450, y: 140, trekkers: 18, meals: 92, wrappers: 29, solar: 79,
      note: 'The first stop on the Lahaul side after descending from the pass. It\'s where trekkers recover from the crossing.' },
    { id: 'chatru', name: 'Chatru', alt: 3350, x: 580, y: 230, trekkers: 26, meals: 133, wrappers: 52, solar: 88,
      note: 'The exit point on the Manali–Spiti road. Final wrapper refunds are paid by UPI here before the drive home.' },
  ],
  marginPerMeal: 62, // ₹ gross margin per meal after food & packaging cost (illustrative)
  pilotMealsPerWeek: 210,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/* ---------- Nav ---------- */
const nav = $('#nav');
const toggle = $('#menuToggle');
toggle.addEventListener('click', () => {
  const open = $('#navLinks').classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  nav.classList.add('scrolled');
});
$$('#navLinks a').forEach((a) => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

/* ---------- Altimeter: page scroll = trek ascent ---------- */
const altStops = [[0, 2050, 'Manali'], [0.18, 3000, 'Jobra'], [0.32, 3100, 'Chika'], [0.5, 3600, 'Balu ka Ghera'], [0.7, 4270, 'Hampta Pass'], [0.85, 3900, 'Shea Goru'], [1, 3350, 'Chatru']];
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60 || $('#navLinks').classList.contains('open'));
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, y / max));
  let i = 0;
  while (i < altStops.length - 2 && p > altStops[i + 1][0]) i++;
  const [p0, a0, n0] = altStops[i];
  const [p1, a1, n1] = altStops[i + 1];
  const t = (p - p0) / (p1 - p0);
  const alt = a0 + (a1 - a0) * t;
  $('#altValue').textContent = Math.round(alt).toLocaleString('en-IN') + ' m';
  $('#altPlace').textContent = t > 0.5 ? n1 : n0;
  $('#altFill').style.height = ((alt - 2050) / (4270 - 2050)) * 100 + '%';
  $('#altimeter').classList.toggle('show', y > innerHeight * 0.6);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Reveal on scroll + counters ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => io.observe(el));

const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1200);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach((el) => countIO.observe(el));

/* ---------- Menu ---------- */
function renderMenu(activeId) {
  $('#menuItems').innerHTML = DATA.menu.map((m) => `
    <button class="menu-item ${m.id === activeId ? 'active' : ''}" role="tab" aria-selected="${m.id === activeId}" data-id="${m.id}">
      <span><span class="name">${m.name}</span><span class="meta" style="display:block">${m.meta}</span></span>
      <span class="price">${inr(m.price)}</span>
    </button>`).join('');
  const m = DATA.menu.find((x) => x.id === activeId);
  $('#mdTag').textContent = m.tag;
  $('#mdName').textContent = m.name;
  $('#mdDesc').textContent = m.desc;
  $('#mdKcal').textContent = m.kcal;
  $('#mdProtein').textContent = m.protein;
  $('#mdWeight').textContent = m.weight;
  $('#mdPrice').textContent = inr(m.price);
  $('#mdTotal').textContent = inr(m.price + 50);
}
$('#menuItems').addEventListener('click', (e) => {
  const b = e.target.closest('.menu-item');
  if (b) renderMenu(b.dataset.id);
});
renderMenu('rajma');

/* ---------- Stall hotspots ---------- */
function setSpec(i) {
  $$('.hotspot').forEach((h) => h.classList.toggle('active', h.dataset.spec === String(i)));
  $$('.spec').forEach((s) => s.classList.toggle('active', s.dataset.spec === String(i)));
}
$$('[data-spec]').forEach((el) => el.addEventListener('click', () => setSpec(el.dataset.spec)));

/* ---------- Routes ---------- */
function setRoute(i) {
  const r = DATA.routes[i];
  $$('.route-tab[data-route]').forEach((t) => t.classList.toggle('active', t.dataset.route === String(i)));
  $('#routePath').setAttribute('d', r.path);
  $('#routeInfo').innerHTML = `
    <span class="mono" style="color:var(--saffron)">${r.reach}</span>
    <h3>${r.name}</h3>
    <p>${r.body}</p>
    <div class="route-kv">${r.kv.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
}
$('#routeTabs').addEventListener('click', (e) => {
  const t = e.target.closest('[data-route]');
  if (t) setRoute(+t.dataset.route);
});
setRoute(0);

/* ---------- Weight calculator ---------- */
// Per meal: raw ingredients + cooking water share + LPG share ≈ 1.25 kg vs ≈ 0.125 kg pouch incl. heater pad.
function calcWeight() {
  const meals = +$('#mealsRange').value;
  const raw = meals * 1.25;
  const dry = meals * 0.125;
  $('#mealsVal').textContent = meals.toLocaleString('en-IN');
  $('#rawKg').textContent = Math.round(raw).toLocaleString('en-IN') + ' kg';
  $('#dryKg').textContent = Math.round(dry).toLocaleString('en-IN') + ' kg';
  const scale = 1500 * 1.25;
  $('#rawBar').style.transform = `scaleX(${raw / scale})`;
  $('#dryBar').style.transform = `scaleX(${Math.max(dry / scale, 0.01)})`;
  $('#rawBar').style.width = '100%';
  $('#dryBar').style.width = '100%';
  $('#muleTrips').textContent = Math.ceil(raw / 60);
  $('#porterLoads').textContent = Math.ceil(dry / 12);
  $('#cylinders').textContent = Math.ceil(meals / 85);
}
$('#mealsRange').addEventListener('input', calcWeight);
calcWeight();

/* ---------- Deposit loop + passport ---------- */
let held = 0, back = 0, stamps = 0, wrapperId = 0;
function addStamp(label) {
  if (stamps >= 3) return;
  const slot = $$('.stamp-slot')[stamps];
  slot.classList.add('stamped');
  slot.textContent = label;
  stamps++;
  if (stamps === 3) $('#chaiUnlock').classList.add('show');
}
function renderWallet() {
  $('#depositHeld').textContent = inr(held);
  $('#depositBack').textContent = inr(back);
  $('#wrapEmpty').style.display = $$('.wrapper-chip:not(.gone)').length ? 'none' : '';
}
$('#buyMeal').addEventListener('click', () => {
  if ($$('.wrapper-chip:not(.gone)').length >= 8) {
    $('#loopToast').textContent = 'Your backpack is full of wrappers. Return some for refunds first.';
    return;
  }
  held += 50;
  const chip = document.createElement('button');
  chip.className = 'wrapper-chip';
  chip.setAttribute('aria-label', 'Return empty wrapper for ₹50');
  chip.dataset.id = ++wrapperId;
  chip.addEventListener('click', () => {
    if (chip.classList.contains('gone')) return;
    chip.classList.add('gone');
    held -= 50; back += 50;
    addStamp('Returned');
    $('#loopToast').textContent = `Wrapper #${chip.dataset.id} returned. ₹50 sent to your UPI.`;
    renderWallet();
    setTimeout(() => chip.remove(), 300);
  });
  $('#wrappers').appendChild(chip);
  addStamp('Meal');
  $('#loopToast').textContent = 'Enjoy your meal. Tap the empty wrapper to return it.';
  renderWallet();
});
$('#resetLoop').addEventListener('click', () => {
  held = back = stamps = 0;
  $$('.wrapper-chip').forEach((c) => c.remove());
  $$('.stamp-slot').forEach((s, i) => { s.className = 'stamp-slot'; s.textContent = 'Stamp ' + (i + 1); });
  $('#chaiUnlock').classList.remove('show');
  $('#loopToast').textContent = '';
  renderWallet();
});
renderWallet();

/* ---------- Safety map ---------- */
const svgNS = 'http://www.w3.org/2000/svg';
let activeStation = 'balu';
function renderNodes() {
  const g = $('#mapNodes');
  g.innerHTML = '';
  DATA.stations.forEach((s) => {
    const n = document.createElementNS(svgNS, 'g');
    n.setAttribute('class', 'map-node' + (s.id === activeStation ? ' active' : ''));
    n.setAttribute('tabindex', '0');
    n.setAttribute('role', 'button');
    n.setAttribute('aria-label', `${s.name}, ${s.alt} metres`);
    n.innerHTML = `
      <circle class="halo" cx="${s.x}" cy="${s.y}" r="10" fill="none" stroke="#e9a36f" stroke-width="1.5"/>
      <circle class="core" cx="${s.x}" cy="${s.y}" r="8" fill="#f3ecdf" stroke="#16302a" stroke-width="3"/>
      <text x="${s.x + 14}" y="${s.y - 10}">${s.name.toUpperCase()}</text>
      <text x="${s.x + 14}" y="${s.y + 4}" style="fill:#e9a36f">${s.alt.toLocaleString('en-IN')} M</text>`;
    const pick = () => { activeStation = s.id; renderNodes(); renderStation(); };
    n.addEventListener('click', pick);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    g.appendChild(n);
  });
}
const checkedIn = new Set();
function renderStation() {
  const idx = DATA.stations.findIndex((s) => s.id === activeStation);
  const s = DATA.stations[idx];
  const next = DATA.stations[idx + 1];
  $('#stName').textContent = s.name;
  $('#stAlt').textContent = s.alt.toLocaleString('en-IN') + ' m above sea level';
  $('#stStatus').textContent = `Online · solar ${s.solar}% · offline Wi-Fi active`;
  $('#stNote').textContent = s.note;
  $('#stTrekkers').textContent = s.trekkers + (checkedIn.has(s.id) ? 1 : 0);
  $('#stMeals').textContent = s.meals;
  $('#stWrappers').textContent = s.wrappers;
  $('#stNext').textContent = next ? next.name : 'Road head';
  const sos = $('#sosBtn');
  sos.classList.remove('sent');
  sos.querySelector('span').textContent = 'Send SOS via beacon';
  const ci = $('#checkinBtn');
  ci.classList.toggle('done', checkedIn.has(s.id));
  ci.textContent = checkedIn.has(s.id) ? `Checked in at ${s.name}` : 'Log my check-in here';
}
$('#sosBtn').addEventListener('click', () => {
  const b = $('#sosBtn');
  const s = DATA.stations.find((x) => x.id === activeStation);
  b.querySelector('span').textContent = 'Transmitting via satellite…';
  setTimeout(() => {
    b.classList.add('sent');
    b.querySelector('span').textContent = `Demo alert sent. Rescue team notified with ${s.name} coordinates.`;
  }, 1100);
});
$('#checkinBtn').addEventListener('click', () => {
  checkedIn.add(activeStation);
  renderStation();
});
renderNodes();
renderStation();

/* ---------- Demand forecast ---------- */
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayWeight = [0.8, 0.75, 0.8, 0.9, 1.1, 1.4, 1.3];
let passOpen = 1, fest = 0;
function forecast() {
  const snow = +$('#snowR').value;
  const permits = +$('#permitR').value;
  const temp = +$('#tempR').value;
  $('#snowV').textContent = snow + '%';
  $('#permitV').textContent = permits;
  $('#tempV').textContent = temp + '°C';
  // Storm days cluster mid-week as snow probability rises.
  const stormDays = new Set();
  if (snow > 35) stormDays.add(3);
  if (snow > 60) { stormDays.add(2); stormDays.add(4); }
  if (snow > 85) stormDays.add(1);
  const coldBoost = 1 + Math.max(0, -temp) * 0.018; // colder nights → more hot meals per trekker
  const base = (permits / 7) * 1.9 * coldBoost * (fest ? 1.35 : 1) * (passOpen ? 1 : 0.35);
  const vals = days.map((d, i) => {
    let v = base * dayWeight[i];
    if (stormDays.has(i)) v *= 0.25;
    else if (stormDays.has(i - 1)) v *= 1.3; // backlog of trekkers after a storm
    return Math.round(v);
  });
  const total = vals.reduce((a, b) => a + b, 0);
  const max = Math.max(...vals, 1);
  $('#fcChart').innerHTML = vals.map((v, i) => `
    <div class="col"><em>${v}</em><i class="${stormDays.has(i) ? 'storm' : ''}" style="height:${(v / max) * 170}px"></i><span>${days[i]}</span></div>`).join('');
  $('#fcTotal').textContent = total.toLocaleString('en-IN');
  $('#fcTrips').textContent = Math.max(1, Math.ceil((total * 0.125) / 25));
  let advice;
  if (!passOpen) advice = 'The pass is closed, so only round-trip trekkers will come. Stock 65% less and move spare pouches down to Chika.';
  else if (stormDays.size >= 3) advice = `A big storm is likely mid-week. Restock everything by ${days[Math.min(...stormDays) - 1] || 'Mon'} and keep the drone on standby for medical drops.`;
  else if (stormDays.size) advice = `Snow is likely on ${[...stormDays].map((d) => days[d]).join(', ')}. Restock the day before, and expect a rush right after the storm.`;
  else if (fest) advice = 'It\'s a long weekend and the skies are clear. Pre-position extra stock at Balu ka Ghera on Thursday and add a second porter run.';
  else advice = 'The weather is stable. One porter run early in the week covers demand, with almost nothing left over.';
  $('#fcAdvice').textContent = advice;
}
['#snowR', '#permitR', '#tempR'].forEach((id) => $(id).addEventListener('input', forecast));
function bindToggle(sel, key, setter) {
  $(sel).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$(sel + ' button').forEach((x) => x.classList.toggle('on', x === b));
    setter(+b.dataset[key]);
    forecast();
  });
}
bindToggle('#passToggle', 'open', (v) => (passOpen = v));
bindToggle('#festToggle', 'fest', (v) => (fest = v));
forecast();

/* ---------- WhatsApp bot prototype ---------- */
const BOT = {
  start: { text: 'Namaste, trekker! I\'m the Pahadi Baithak bot for the Hampta Pass trail.\nWhat would you like to do?', options: ['menu', 'nearest', 'checkin', 'refund', 'sos'] },
  menu: { label: 'Show menu', text: 'Today\'s trail menu (each meal heats itself in 10 minutes):\n\n1. Rajma Chawal · ₹149\n2. Moong Dal Khichdi · ₹129\n3. Soya Thukpa Broth · ₹139\n4. Masala Oats & Nuts · ₹99\n\nA ₹50 Bring-It-Back deposit is added and refunded when you return the wrapper.', options: ['prebook', 'nearest', 'start'] },
  prebook: { label: 'Pre-book Rajma at Balu ka Ghera', text: 'Booked: 1 × Rajma Chawal at the Balu ka Ghera stall.\nOrder ID: PB-2604-117\nPay ₹199 by UPI at the stall. It\'s kept warm-ready for you until 8 p.m.', options: ['checkin', 'start'] },
  nearest: { label: 'Nearest stall', text: 'Nearest stall: Chika (3,100 m), about 1 h 20 m up the trail from Jobra.\nIt has 141 meals in stock, solar at 86% and offline Wi-Fi switched on.', options: ['menu', 'checkin', 'start'] },
  checkin: { label: 'Log check-in', text: 'You\'re checked in at Chika, 3,100 m, at ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + '.\nYour emergency contact will get an SMS when you reach base camp. If you don\'t check in at Balu ka Ghera within 30 hours, the rescue team is alerted.', options: ['refund', 'start'] },
  refund: { label: 'Return wrapper', text: 'Scan the QR code on your empty pouch at the stall counter.\n\nWrapper verified. ₹50 is on its way to your UPI ID.\nPassport stamp 2/3 added. One more and you get a free chai.', options: ['menu', 'start'] },
  sos: { label: 'SOS', text: 'SOS mode (demo)\nYour last check-in was Chika at 3,100 m. Sharing your location with the stall beacon and the Manali rescue desk.\n\nStay where you are and keep warm. The stall partner is on the way with a first-aid kit and oxygen.', options: ['start'] },
};
BOT.start.label = 'Main menu';
const chatBody = $('#chatBody');
const chatQuick = $('#chatQuick');
function botSay(key) {
  const node = BOT[key];
  chatQuick.innerHTML = '';
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<i></i><i></i><i></i>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => {
    typing.remove();
    const m = document.createElement('div');
    m.className = 'msg bot';
    m.textContent = node.text;
    chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
    node.options.forEach((k) => {
      const b = document.createElement('button');
      b.textContent = BOT[k].label;
      b.addEventListener('click', () => {
        const me = document.createElement('div');
        me.className = 'msg me';
        me.textContent = BOT[k].label;
        chatBody.appendChild(me);
        botSay(k);
      });
      chatQuick.appendChild(b);
    });
  }, 650);
}
const chatIO = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { botSay('start'); chatIO.disconnect(); }
}, { threshold: 0.3 });
chatIO.observe($('#prototype'));

/* ---------- Franchise split ---------- */
const seasons = [
  { us: 55, them: 45, label: 'Season 1' },
  { us: 25, them: 75, label: 'Season 2 onwards' },
];
function setSeason(i) {
  const s = seasons[i];
  $$('#seasonTabs .route-tab').forEach((t) => t.classList.toggle('active', t.dataset.season === String(i)));
  $('#splitUs').style.flexBasis = s.us + '%';
  $('#splitThem').style.flexBasis = s.them + '%';
  $('#splitUs').textContent = `Pahadi Baithak ${s.us}%`;
  $('#splitThem').textContent = `Village partner ${s.them}%`;
  const monthly = DATA.pilotMealsPerWeek * DATA.marginPerMeal * 4.33 * (s.them / 100);
  $('#splitNote').textContent = `Proposed split of gross margin (${s.label}). A pilot stall selling about ${DATA.pilotMealsPerWeek} meals a week earns its partner roughly ${inr(monthly)} a month in peak season, with nothing invested.`;
}
$('#seasonTabs').addEventListener('click', (e) => {
  const t = e.target.closest('[data-season]');
  if (t) setSeason(+t.dataset.season);
});
setSeason(0);

/* ---------- Join form (Netlify Forms) ---------- */
const form = $('#joinForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = $('#formStatus');
  let ok = true;
  [['#fName', (v) => v.trim().length > 1], ['#fEmail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)]].forEach(([sel, test]) => {
    const field = $(sel).closest('.field');
    const valid = test($(sel).value);
    field.classList.toggle('error', !valid);
    if (!valid) ok = false;
  });
  if (!ok) { status.className = 'form-status bad'; status.textContent = 'Please fix the highlighted fields.'; return; }
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = '';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    status.className = 'form-status ok';
    status.textContent = 'Thank you! Team Baithak Ho Jaye will be in touch soon.';
  } catch {
    status.className = 'form-status bad';
    status.textContent = 'Something went wrong. Please try again in a moment.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send to Team Baithak Ho Jaye';
  }
});
$$('#fName, #fEmail').forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('error')));

/* ---------- Customer review form (Netlify Forms) ---------- */
const reviewForm = $('#reviewForm');
const mealSelect = $('#rMeal');
DATA.menu.forEach((m) => mealSelect.insertBefore(new Option(m.name, m.name), mealSelect.lastElementChild));
$('#rStall').placeholder = `e.g. ${DATA.stations.map((s) => s.name).slice(0, 2).join(', ')}`;

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = $('#reviewStatus');
  let ok = true;
  [
    ['#rName', (el) => el.value.trim().length > 1],
    ['#rEmail', (el) => !el.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)],
    ['#rMsg', (el) => el.value.trim().length > 2],
    ['#rStars', () => !!reviewForm.querySelector('input[name=rating]:checked')],
  ].forEach(([sel, test]) => {
    const field = $(sel).closest('.field');
    const valid = test($(sel));
    field.classList.toggle('error', !valid);
    if (!valid) ok = false;
  });
  if (!ok) { status.className = 'form-status bad'; status.textContent = 'Please fix the highlighted fields.'; return; }
  const btn = reviewForm.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = '';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(reviewForm)).toString(),
    });
    if (!res.ok) throw new Error(res.status);
    reviewForm.reset();
    status.className = 'form-status ok';
    status.textContent = 'Thank you for the review! It helps us make the next baithak better.';
  } catch {
    status.className = 'form-status bad';
    status.textContent = 'Something went wrong. Please try again in a moment.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit review';
  }
});
$$('#rName, #rEmail, #rMsg').forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('error')));
$$('#rStars input').forEach((el) => el.addEventListener('change', () => $('#rRatingField').classList.remove('error')));
