const GS_ICON = './gsquad-icon-192.png';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (allClients.length) {
      allClients[0].focus();
      return;
    }
    await clients.openWindow('./index.html');
  })());
});
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data && data.type === 'GS_NOTIFY') {
    const title = data.title || 'G-SQUAD';
    const options = Object.assign({
      body: 'Session lancée.',
      icon: GS_ICON,
      badge: GS_ICON,
      tag: 'gsquad-session',
      renotify: true,
      silent: false,
      data: { url: './index.html' }
    }, data.options || {});
    event.waitUntil(self.registration.showNotification(title, options));
  }
});
