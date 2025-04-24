const CACHE_NAME = "asistencia-cache-v1";
const urlsToCache = [
  './',
  './index.html',
  './editar_materias.html',
  './asistencias.html',
  './resumen.html',
  './CSS/estilos.css',
  './JS/script.js',
  './manifest.json',
  './IMG/icono.png'
];

// Instalar SW y cachear archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar SW
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
