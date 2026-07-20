# PINIT — kako pokrenuti sistem

## Šta je u paketu
- `server.js` — server (čisti Node.js, bez ikakvih instalacija)
- `public/app.html` — mobilna aplikacija V5 (prijave + Drive mjerenje)
- `public/platforma.html` — operativna platforma za PRIJAVE građana (dispečer, radnici, SLA, analitika)
- `public/komandni.html` — komandni centar za DRIVE (stanje cesta, IRI, žarišta)
- `data.json` — nastaje sam; tu su nalozi, prijave, vožnje i radnici

## Ko šta koristi
- Građanin → `app.html`: prijavljuje probleme i mjeri ceste dok vozi
- Dispečer / komunalno → `platforma.html`: prima prijave, dodjeljuje radnicima, mijenja status
- Grad / uprava → `komandni.html`: prati stanje cesta iz Drive vožnji

Isti tok podataka:
  V5 prijava  → server → PLATFORMA (dispečer dodjeljuje, rješava) → status nazad u V5
  V5 vožnja   → server → KOMANDNI (analiza stanja mreže)

## A) Test kod kuće (telefon + laptop na istoj Wi-Fi)
1. Instaliraj Node.js sa nodejs.org
2. `node server.js`
3. Server ispiše adrese:
   - aplikacija:          http://192.168.x.x:3000
   - platforma (prijave): http://192.168.x.x:3000/platforma
   - komandni (Drive):    http://192.168.x.x:3000/komandni
4. Telefon → aplikacija → nalog → prijavi problem
5. Laptop → platforma → prijava se pojavi u "Zadaci"; dodaj radnika (Radnici uživo →
   "➕ Dodaj radnika"), dodijeli mu zadatak, označi riješeno → status se vidi u aplikaciji
   NAPOMENA: preko običnog http GPS/senzori rade samo na localhost — za telefon koristi
   online varijantu (B) ili HTTPS tunel (npx localtunnel --port 3000).

## B) Online (Render — HTTPS, radi svugdje)
Netlify NE radi za ovo (samo statika). Render:
1. Cijeli folder na GitHub (server.js mora biti na vrhu, ne u podfolderu)
2. render.com → New → Web Service → poveži repo → prepozna render.yaml → Deploy
3. Adrese:
   - https://ime.onrender.com            (aplikacija)
   - https://ime.onrender.com/platforma  (prijave)
   - https://ime.onrender.com/komandni   (Drive)
Free plan: server zaspi nakon 15 min (prvi ulaz ~30 s) i data.json se briše pri deployu —
za test uredu; za pravi pilot dodajemo bazu.

## Radnici (Platforma)
- Dodaješ ih u "Radnici uživo" dugmetom "➕ Dodaj radnika" (ime + uloga; odjel = trenutni tab)
- Odjeli: JKP Putevi, Vodovod, Elektroprivreda, Čistoća
- Prijave se same razvrstavaju u odjel po kategoriji (rupa→Putevi, curenje/poplava→Vodovod,
  rasvjeta→Elektroprivreda, otpad→Čistoća, ostalo→Putevi)
- Prioritet se računa iz glasova građana (25+ = hitno, 10+ = srednje, inače nisko)

## Napomena o analitici Platforme
Ekrani Učinak / Smjene / Pravednost / Prognoze / Zadovoljstvo traže sedmice podataka i
ocjene građana. Dok nema dovoljno stvarnih prijava, na njima stoji žuto upozorenje da su
prikazane vrijednosti ilustrativne, ne stvarni pokazatelji. Zadaci, Radnici i osnovni
brojevi su stvarni od prve prijave.

