const CACHE_NAME = 'guarderia-pwa-v1';
const assetsToCache = [
    'index.html',
    'styles.css',
    'app.js',
    'perros.json'
];

// Instalación del Service Worker
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones para funcionamiento offline
self.addEventListener('fetch', (e) => {
    e.respondId ? e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    ) : e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});