// Funciones genéricas que pueden usarse en cualquier módulo

export function mostrarMensajePersonalizado(mensaje) {
    let modal = document.createElement("div");
    modal.id = "modal-mensaje";
    modal.innerHTML = `
    <div class="modal-fondo"></div>
    <div class="modal-contenido">
      <p>${mensaje}</p>
      <button id="cerrar-modal">Aceptar</button>
    </div>
  `;
    document.body.appendChild(modal);

    document.getElementById("cerrar-modal").addEventListener("click", () => {
        document.body.removeChild(modal);
    });
}

export function quitarAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function convertirAHorasDecimal(horaStr) {
    const [h, m] = horaStr.split(":").map(Number);
    return h + m / 60;
}

export function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function horariosSeSolapan(h1_ini, h1_fin, h2_ini, h2_fin) {
    return (h1_ini < h2_fin && h1_fin > h2_ini);
}