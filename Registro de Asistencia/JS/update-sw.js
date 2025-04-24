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