const CACHE_NAME = "asistencia-cache-v8";
// Versión del caché, puedes incrementarlo para forzar la actualización

// Lista de URLs a cachear
const urlsToCache = [
  "./",
  "./index.html",
  "./editar_materias.html",
  "./asistencias.html",
  "./resumen.html",
  "./CSS/estilos.css",
  "./JS/script.js",
  "./IMG/icono.png",
  // Agrega aquí otros recursos que se necesites cachear
];

// Instala el service worker y cachea los recursos
// El service worker se instala cuando el navegador lo encuentra por primera vez
self.addEventListener("install", event => {
  self.skipWaiting(); // Fuerza la activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activa el service worker y limpia cachés viejos
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

// Intercepta las solicitudes de red y responde con el caché si está disponible
// Si no está en caché, hace una solicitud de red y lo guarda en caché
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      })
      .catch(() => caches.match(event.request)) // Si falla la red, usa el caché
  );
});