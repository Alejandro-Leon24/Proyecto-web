// Este archivo se encarga de registrar el service worker y de actualizarlo si hay una nueva versión disponible.
// Se registra el service worker y se comprueba si hay una nueva versión disponible y te notifica si la hay.
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        installingWorker.onstatechange = () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            alert("¡Nueva versión disponible! Se actualizará la pagina para nuevos cambios.");
            window.location.reload();
          }
        };
      };
    });
  }