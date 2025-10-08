// ============================================
// PONTOLABS - SERVICE WORKER
// ============================================

const CACHE_NAME = 'pontolabs-v1';
const OFFLINE_URL = '/pages/offline.html';

const STATIC_CACHE = [
  '/',
  '/index.html',
  '/pages/login.html',
  '/assets/css/global.css',
  '/assets/js/config.js',
  '/assets/js/db.js',
  '/manifest.json'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response and cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((response) => {
          return response || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Background sync for offline pontos
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pontos') {
    event.waitUntil(syncPontos());
  }
});

async function syncPontos() {
  // Esta função será implementada quando o IndexedDB for criado
  console.log('Sincronizando pontos offline...');
}
