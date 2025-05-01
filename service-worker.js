
const CACHE_NAME = 'turbosign-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/editor.html',
  '/styles.css',
  '/_redirects.txt',
  '/manifest.json',
  '/scripts/app.js',
  '/scripts/uiHandler.js',
  '/scripts/pdfHandler.js',
  '/scripts/signatureHandler.js',
  '/scripts/storageHandler.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
