// G-SQUAD Service Worker - version minimale
// Ne cache rien, mais permet aux notifications de fonctionner

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Pas de fetch handler -> le browser fetch normalement, sans cache SW
// Cela évite que le SW serve une vieille version cassée

// Notifications de rappel d'inactivité (utilisé par scheduleInactivityReminder)
self.addEventListener('message', function(event) {
  var data = event.data || {};
  if (data.type === 'SCHEDULE_REMINDER') {
    setTimeout(function() {
      self.registration.showNotification(data.title || 'G-SQUAD', {
        body: data.body || 'C\'est le moment de bouger !',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/icon-192x192.png',
        tag: 'gs-inactivity'
      });
    }, data.delay || 5000);
  }
  if (data.type === 'GS_NOTIFY') {
    self.registration.showNotification(data.title || 'G-SQUAD', data.options || {});
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if ('focus' in clientList[i]) return clientList[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
