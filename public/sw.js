const CACHE_NAME = "reloved-v1";

// Install event: Here we can cache the "app shell"
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
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

// Fetch event: Network first, falling back to cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests like Google Fonts or Supabase for simplicity in this basic SW
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle page navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle other requests (images, css, js) - Stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});