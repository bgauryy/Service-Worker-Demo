const CACHE_NAME = 'CACHE_NAME';
const CACHE_FILES = [
  '/',
  'index.html',
  'logo.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('fetch', function (event) {
  //simple intercept
  if (event.request.url.includes('someFetch')) {
    return event.respondWith(
      new Response('XHR Intercepted!', {
        status: 200
      })
    );
  } else {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(event.request);
        console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
        if (cachedResponse) {
          return cachedResponse;
        }
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
        cache.put(event.request, response.clone());
        return response;
      })()
    );
  }
});