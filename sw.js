self.addEventListener('install', (e) => {
  console.log('Service Worker telepítve');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});