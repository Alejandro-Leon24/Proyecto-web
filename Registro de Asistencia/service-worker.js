const CACHE_NAME = "asistencia-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./editar_materias.html",
  "./asistencias.html",
  "./resumen.html",
  "./CSS/estilos.css",
  "./JS/asistencias.js",
  "./JS/main.js",
  "./JS/materias.js",
  "./JS/resumen.js",
  "./JS/utilidades.js",
  "./IMG/icono.png",
];

// Instala el service worker y cachea los recursos
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activa el service worker y limpia cachés viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log("Eliminando caché viejo:", key);
          return caches.delete(key);
        })
      )
    )
  );
  return self.clients.claim();
});

// Intercepta las solicitudes de red y responde con el caché si está disponible
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      })
      .catch(() => caches.match(event.request))
  );
});