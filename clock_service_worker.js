const CACHE_NAME = "clock-pwa-v7";

const FILES_TO_CACHE = [
  "clock_viewer_android.html",
  "clock_manifest.json",
  "clock_icon_192.png",
  "clock_icon_512.png"
];

// установка
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// активация (чистим старые кеши)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// перехват запросов
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});