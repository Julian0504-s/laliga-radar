// LaLiga Radar – Service Worker
// App files: network first (always fresh), cache as offline fallback.
// Library + textures from the CDN: cache first (they are versioned and never change).
// Live data (ESPN): never cached.
const CACHE = 'laliga-radar-v2';
const SETTINGS = 'laliga-settings'; // written by the page: favourite club + notification settings
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const CDN = 'https://cdnjs.cloudflare.com/';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== SETTINGS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.href.startsWith(CDN)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      // 'no-cache' revalidates with the server, so a new app version shows up right away.
      fetch(req, { cache: 'no-cache' }).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
  }
  // Everything else (live APIs) goes straight to the network.
});

// Tapping a notification opens (or focuses) the app.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const win = wins.find(w => w.url.startsWith(self.registration.scope));
    if (win) return win.focus();
    return self.clients.openWindow(url);
  })());
});

// Background check while the app is closed. Chrome decides how often this runs for an installed app
// (often only every few hours), so it is good for a reminder or the final score, not for live goals.
self.addEventListener('periodicsync', e => {
  if (e.tag === 'laliga-check') e.waitUntil(backgroundCheck());
});

async function backgroundCheck() {
  const store = await caches.open(SETTINGS);
  const res = await store.match('settings');
  if (!res) return;
  const s = await res.json();
  if (!s.on || !s.fav) return;
  s.sent ||= {};
  const day = d => d.toISOString().slice(0, 10).replace(/-/g, '');
  const now = new Date();
  const dates = [day(new Date(now - 864e5)), day(now), day(new Date(+now + 864e5))];
  const crest = id => `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${id}.png&h=192&w=192`;
  const show = (title, body, tag) => self.registration.showNotification(title, { body, tag, icon: crest(s.fav), badge: 'icons/badge-96.png', data: { url: self.registration.scope } });
  for (const d of dates) {
    let data;
    try { data = await (await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${d}`)).json(); } catch { continue; }
    for (const ev of data.events || []) {
      const c = ev.competitions[0];
      const H = c.competitors.find(x => x.homeAway === 'home'), A = c.competitors.find(x => x.homeAway === 'away');
      if (H.team.id !== s.fav && A.team.id !== s.fav) continue;
      const label = `${H.team.shortDisplayName} – ${A.team.shortDisplayName}`;
      const kick = Date.parse(ev.date), mins = (kick - Date.now()) / 60e3;
      const st = c.status?.type || {};
      if (st.state === 'pre' && s.reminder && mins > 0 && mins <= Math.max(s.reminder, 180) && !s.sent[`rem-${ev.id}`]) {
        s.sent[`rem-${ev.id}`] = Date.now();
        await show(`Gleich geht's los: ${label}`,`Anpfiff heute um ${new Date(kick).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr`, `rem-${ev.id}`);
      }
      if (st.completed && s.final && !s.sent[`ft-${ev.id}`] && Date.now() - kick < 24 * 3600e3) {
        s.sent[`ft-${ev.id}`] = Date.now();
        const my = H.team.id === s.fav ? +H.score : +A.score, ot = H.team.id === s.fav ? +A.score : +H.score;
        await show(`${my > ot ? 'Sieg' : my === ot ? 'Unentschieden' : 'Niederlage'}:${H.team.shortDisplayName} ${H.score}:${A.score} ${A.team.shortDisplayName}`, 'Endstand', `ft-${ev.id}`);
      }
    }
  }
  await store.put('settings', new Response(JSON.stringify(s)));
}
