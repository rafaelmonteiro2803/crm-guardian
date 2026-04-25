const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
};

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if assets not available
        console.warn('Failed to cache some static assets');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for API, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network First with timeout
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/rest')) {
    event.respondWith(
      Promise.race([
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAMES.api).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), 3000)
        ),
      ]).catch(() => {
        return caches
          .match(request)
          .then(
            (response) =>
              response || new Response('Offline - cached data unavailable', { status: 503 })
          );
      })
    );
  } else {
    // Static assets - Cache First
    event.respondWith(
      caches
        .match(request)
        .then((response) => response || fetch(request))
        .catch(() => new Response('Asset not available', { status: 404 }))
    );
  }
});

// Background Sync for offline mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(
      caches
        .open(CACHE_NAMES.api)
        .then((cache) => cache.keys())
        .then((requests) => {
          // Process queued mutations
          return Promise.allSettled(
            requests
              .filter((req) => req.method !== 'GET')
              .map((req) => fetch(req))
          );
        })
        .catch((err) => console.warn('Sync failed:', err))
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    tag: 'guardian-notification',
    requireInteraction: false,
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.title = data.title || 'Guardian CRM';
      options.body = data.body || 'Nova notificação';
      options.icon = data.icon || options.icon;
    } catch {
      options.title = 'Guardian CRM';
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification('Guardian CRM', options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      return clients.openWindow(event.notification.data.url || '/m/');
    })
  );
});
