const CACHE_NAME = 'meyhane-pwa-fix-v2'; // ÖNEMLİ: cache versiyonu artırıldı
const URLS = [
  './index.html',
  './manifest.webmanifest',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/main.min.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/locales-all.global.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
