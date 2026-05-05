// G-SQUAD Service Worker
const CACHE = 'gsquad-v1';
const STATIC = ['/', '/index.html', '/style.css', '/app.js', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'G-SQUAD';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: data
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'GS_NOTIFY') {
    const { title, options } = e.data;
    self.registration.showNotification(title || 'G-SQUAD', options || {});
  }
});
