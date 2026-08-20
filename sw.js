self.addEventListener('install', (e) => {
  console.log('Service Worker telepítve');
});

self.addEventListener('fetch', (e) => {
  // Alapértelmezett kérések átengedése
  e.respondWith(fetch(e.request));
});