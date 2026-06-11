const CACHE_NAME = "clock-pwa-split-mode-v1";

const FILES_TO_CACHE = [
  "ClockViewerAndroid.html?mode=local",
  "clock_manifest.json",
  "clock_icon_192.png",
  "clock_icon_512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isClockHtml = url.pathname.endsWith("ClockViewerAndroid.html");
  const isLocalMode = url.searchParams.get("mode") === "local";

  if (isClockHtml && isLocalMode) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }

  if (isClockHtml) {
    event.respondWith(
      fetch(req, { cache: "reload" }).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});