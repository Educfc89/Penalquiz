// Penalquiz · service worker: permite instalar la app y abrirla rápido (primero red, si no hay, lo guardado)
const CACHE = 'penalquiz-v4';
const BASICOS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'favicon.png', 'logo.png', 'portada-720.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // el servidor de Google no pasa por acá
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {}); }   // nunca guardar errores (404)
    return r;
  }).catch(() => caches.match(e.request)));
});
