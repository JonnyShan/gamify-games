// Serves a draft brand pack, made in /pack-maker/, to every game on this site.
// Only paths like /<game>/brand/draft/... or /<game>/brands/draft/... are touched.
const CACHE = 'gamify-draft-pack';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || !/\/brands?\/draft\//.test(u.pathname)) return;
  e.respondWith(
    caches.open(CACHE)
      .then((c) => c.match(u.origin + u.pathname))
      .then((r) => r || new Response('not found', { status: 404 }))
  );
});
