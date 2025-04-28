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
        // Renderizar tabla resumen
        const clone = resumenTemplate.content.cloneNode(true);
        container.innerHTML = "";
        container.appendChild(clone);

        // Calcular totales y porcentajes por materia, deduplicando por materia, día y fecha
        const resumen = {};
        const yaContados = new Set();

        asistencias.forEach(a => {
            const fecha = new Date(a.fecha);
            const clave = `${a.materiaId}_${a.dia}_${fecha.toDateString()}`;
            if (!yaContados.has(clave)) {
                if (!resumen[a.materiaNombre]) resumen[a.materiaNombre] = { total: 0, asistio: 0 };
                resumen[a.materiaNombre].total++;
                if (a.asistio === "si") resumen[a.materiaNombre].asistio++;
                yaContados.add(clave);
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

        // Fila de asistencias "sí"
        const filaAsistencias = container.querySelector("#totales-resumen");
        materias.forEach(m => {
            const td = document.createElement("td");
            td.textContent = resumen[m].asistio;
            filaAsistencias.appendChild(td);
        });

        // Fila de total de clases
        const filaClases = container.querySelector("#clases-resumen");
        if (filaClases) {
            materias.forEach(m => {
                const td = document.createElement("td");
                td.textContent = resumen[m].total;
                filaClases.appendChild(td);
            });
        }

        // Fila de porcentaje de asistencia
        const filaPorcentaje = container.querySelector("#porcentaje-resumen");
        if (filaPorcentaje) {
            materias.forEach(m => {
                const td = document.createElement("td");
                const porcentaje = resumen[m].total > 0
                    ? Math.round((resumen[m].asistio / resumen[m].total) * 100)
                    : 0;
                td.textContent = `${porcentaje}%`;
                filaPorcentaje.appendChild(td);
            });
        }

        // Observaciones
        const pocas = materias.filter(m => resumen[m].asistio < 3);
        const porcentajeBajo = materias.filter(m =>
            resumen[m].total > 0 &&
            (resumen[m].asistio / resumen[m].total) < 0.6
        );
        const reporte = container.querySelector("#reporte-asistencia");
        if (pocas.length > 0) {
            reporte.textContent = "Tienes poca asistencia en: " + pocas.join(", ");
        } else if (porcentajeBajo.length > 0) {
            reporte.textContent = "Atención: asistencia baja en: " + porcentajeBajo.join(", ");
        } else {
            reporte.textContent = "Tienes todas las asistencias completas.";
        }

        // Total general
        const totalGeneral = document.createElement("p");
        const totalAsistencias = materias.reduce((s, m) => s + resumen[m].asistio, 0);
        const totalClases = materias.reduce((s, m) => s + resumen[m].total, 0);
        totalGeneral.textContent = `Total general de asistencias: ${totalAsistencias} de ${totalClases} (${totalClases > 0 ? Math.round(totalAsistencias / totalClases * 100) : 0}%)`;
        container.appendChild(totalGeneral);

    }
}