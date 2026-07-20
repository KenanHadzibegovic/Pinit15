#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════
   ugradi-komandni.js

   Platforma nosi UGRAĐENU KOPIJU komandnog centra (Drive kartica) —
   zapisanu kao base64 unutar <script id="driveDoc">. Zbog toga izmjene
   u public/komandni.html NE stižu same u Platformu; kopija zastari i
   grad u Drive kartici gleda staru verziju.

   Ova skripta prepiše tu kopiju svježim sadržajem komandni.html.

   POKRENI POSLIJE SVAKE IZMJENE komandni.html:
       node ugradi-komandni.js
   ══════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const KOM = path.join(__dirname, 'public', 'komandni.html');
const PLT = path.join(__dirname, 'public', 'platforma.html');

for (const f of [KOM, PLT]) {
  if (!fs.existsSync(f)) { console.error('Nema fajla: ' + f); process.exit(1); }
}

const kom = fs.readFileSync(KOM, 'utf8');
let plt = fs.readFileSync(PLT, 'utf8');

const b64 = Buffer.from(kom, 'utf8').toString('base64');
const re = /(<script[^>]*id="driveDoc"[^>]*>)([\s\S]*?)(<\/script>)/;
const m = plt.match(re);
if (!m) { console.error('Nije pronađen <script id="driveDoc"> u platforma.html'); process.exit(1); }

const staro = m[2].trim().length;
plt = plt.replace(re, (_, a, __, c) => a + '\n' + b64 + '\n' + c);
fs.writeFileSync(PLT, plt);

console.log('Komandni centar ugrađen u Platformu.');
console.log('  izvor:  public/komandni.html  (' + kom.length.toLocaleString('bs') + ' znakova)');
console.log('  prije:  ' + staro.toLocaleString('bs') + ' znakova base64');
console.log('  sada:   ' + b64.length.toLocaleString('bs') + ' znakova base64');
