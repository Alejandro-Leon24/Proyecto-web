const CACHE_NAME = "asistencia-cache-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./editar_materias.html",
  "./asistencias.html",
  "./resumen.html",
  "./CSS/estilos.css",
  "./JS/script.js",
  "./IMG/icono.png",
  // Agrega aquí otros recursos que necesites cachear
];

self.addEventListener("install", event => {
  self.skipWaiting(); // Fuerza la activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response ||
      fetch(event.request).then(fetchRes =>
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        })
      )
    )
  );
});