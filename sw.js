// NEVARA · service worker « réseau d'abord » : la version en ligne est
// toujours servie en priorité, le cache ne sert que de secours hors ligne.
const CACHE = 'nevara-v1';
const BASE = ['/', '/association', '/fracture', '/soutenir', '/contact', '/assets/site.css', '/assets/site.js', '/assets/logo.webp', '/assets/logo-sm.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copie = res.clone(); caches.open(CACHE).then(c => c.put(req, copie)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/')))
  );
});
