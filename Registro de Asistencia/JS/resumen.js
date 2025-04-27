export function initResumen() {
    const container = document.querySelector("main");
    const resumenTemplate = document.getElementById("resumen-asistencia");

    // Revisamos si hay datos de asistencia
    const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];

    if (asistencias.length === 0) {
        // Mostrar mensaje si no hay asistencias
        const mensaje = document.createElement("div");
        mensaje.id = "mensaje-resumen-vacio";
        mensaje.textContent = "Por ahora no hay asistencias registradas.";
        container.innerHTML = ""; // limpiar el main por si acaso
        container.appendChild(mensaje);
    } else {
        // Aquí iría el renderizado de tabla resumen si hay datos
        const clone = resumenTemplate.content.cloneNode(true);
        container.innerHTML = "";
        container.appendChild(clone);
        // ... aquí puedes continuar mostrando datos
        const resumen = {};
        asistencias.forEach(a => {
            if (a.asistio === "si") {
                if (!resumen[a.materiaNombre]) resumen[a.materiaNombre] = 0;
                resumen[a.materiaNombre]++;
            }
        });

        const materias = Object.keys(resumen);

        // Construir encabezado dinámico
        const encabezado = container.querySelector("#encabezado-resumen");
        materias.forEach(m => {
            const th = document.createElement("th");
            th.textContent = m;
            encabezado.appendChild(th);
        });

        // Construir fila de totales
        const filaTotales = container.querySelector("#totales-resumen");
        materias.forEach(m => {
            const td = document.createElement("td");
            td.textContent = resumen[m];
            filaTotales.appendChild(td);
        });

        // Mostrar observaciones
        const pocas = materias.filter(m => resumen[m] < 3);
        const total = Object.values(resumen).reduce((a, b) => a + b, 0);

        const reporte = container.querySelector("#reporte-asistencia");
        if (pocas.length > 0) {
            reporte.textContent = "Tienes poca asistencia en: " + pocas.join(", ");
        } else {
            reporte.textContent = "Tienes todas las asistencias completas.";
        }

        // Agregar total general
        const totalGeneral = document.createElement("p");
        totalGeneral.textContent = `Total general de asistencias: ${total}`;
        container.appendChild(totalGeneral);

    }
}
