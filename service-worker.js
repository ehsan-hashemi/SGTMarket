self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("sgt-market-cache").then(cache => {
            return cache.addAll(["/", "/index.html", "/styles.css", "/script.js"]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('install', event => {
    console.log('Service Worker نصب شد');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker فعال شد');
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    clients.openWindow('/');
});
