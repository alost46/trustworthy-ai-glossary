const CACHE_NAME = "clock-viewer-android-v3";
const FILES = [
  "./clock_viewer_android.html",
  "./clock_manifest.json",
  "./clock_icon_192.png",
  "./clock_icon_512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
