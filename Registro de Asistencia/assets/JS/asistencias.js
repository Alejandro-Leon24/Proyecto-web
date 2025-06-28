import { mostrarMensajePersonalizado, quitarAcentos, convertirAHorasDecimal } from './utilidades.js';

export function initRegistroAsistencia() {
    const spanMateria = document.getElementById("nombre-materia");
    const mensajeElement = document.querySelector("p");
    const form = document.getElementById("form-asistencia");

    async function actualizarVistaAsistencia() {
        const ahora = new Date();
        const diaActual = quitarAcentos(
            ahora.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase()
        );
        const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

        try {
            const response = await fetch(`Controlador/AsistenciaController.php?dia=${diaActual}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const materiasHoy = await response.json();

            if (materiasHoy.error) {
                mostrarMensajePersonalizado(materiasHoy.error);
                return;
            }

            // Buscar materia actual (clase en curso)
            let materiaActual = null;
            for (let m of materiasHoy) {
                const hInicio = convertirAHorasDecimal(m.hora_inicio);
                const hFin = convertirAHorasDecimal(m.hora_fin);
                if (horaActual >= hInicio && horaActual <= hFin) {
                    materiaActual = m;
                    break;
                }
            }

            // Buscar siguientes clases
            const siguientes = materiasHoy
                .filter(m => convertirAHorasDecimal(m.hora_inicio) > horaActual)
                .sort((a, b) => convertirAHorasDecimal(a.hora_inicio) - convertirAHorasDecimal(b.hora_inicio));

            function obtenerMensajeSiguienteClase() {
                if (siguientes.length > 0) {
                    const siguiente = siguientes[0];
                    const mins = Math.round((convertirAHorasDecimal(siguiente.hora_inicio) - horaActual) * 60);

                    if (mins <= 0) {
                        return `¡Tu siguiente clase, <b>${siguiente.nombre}</b>, ya empezó a las ${siguiente.hora_inicio}!`;
                    } else if (mins <= 5) {
                        return `¡Tu siguiente clase, <b>${siguiente.nombre}</b>, empieza en ${mins} minutos (${siguiente.hora_inicio})! 🕐`;
                    } else if (mins <= 30) {
                        return `Tu siguiente clase, <b>${siguiente.nombre}</b>, empieza en ${mins} minutos (${siguiente.hora_inicio}).`;
                    } else {
                        const horas = Math.floor(mins / 60);
                        const minutosRestantes = mins % 60;
                        if (horas > 0) {
                            return `Tu siguiente clase, <b>${siguiente.nombre}</b>, es en ${horas}h ${minutosRestantes}min (${siguiente.hora_inicio}).`;
                        } else {
                            return `Tu siguiente clase, <b>${siguiente.nombre}</b>, es en ${mins} minutos (${siguiente.hora_inicio}).`;
                        }
                    }
                } else {
                    return `🎉 No tienes más clases pendientes por hoy. ¡Disfruta tu tiempo libre!`;
                }
            }

            // **CASO 1: SIN CLASE ACTUAL**
            if (!materiaActual) {
                spanMateria.textContent = "______";

                if (siguientes.length > 0) {
                    const siguiente = siguientes[0];
                    const mins = Math.round((convertirAHorasDecimal(siguiente.hora_inicio) - horaActual) * 60);

                    if (mins <= 10) {
                        mensajeElement.innerHTML = `⏰ <b>¡Prepárate!</b> Tu clase de <b>${siguiente.nombre}</b> empieza en ${mins} minutos.<br><small>No tienes clase en este momento, pero pronto empezará la siguiente.</small>`;
                    } else {
                        mensajeElement.innerHTML = `📅 No tienes clase en este momento.<br>${obtenerMensajeSiguienteClase()}`;
                    }
                } else {
                    mensajeElement.innerHTML = `📅 No tienes clase en este momento.<br>🎉 No tienes más clases pendientes por hoy. ¡Disfruta tu tiempo libre!`;
                }

                form.onsubmit = (e) => {
                    e.preventDefault();
                    mostrarMensajePersonalizado("⚠️ No puedes registrar asistencia porque no tienes clase en este momento.");
                };
                return;
            }

            // **CASO 2: HAY CLASE ACTUAL**
            spanMateria.textContent = materiaActual.nombre;

            // Verificar si ya está registrada
            const asistenciasLocal = JSON.parse(localStorage.getItem("asistencias")) || [];
            const yaRegistrada = asistenciasLocal.some(a => {
                const fecha = new Date(a.fecha);
                return (
                    a.materiaId == materiaActual.id &&
                    a.dia === diaActual &&
                    fecha.toDateString() === ahora.toDateString()
                );
            });

            if (yaRegistrada) {
                // **CASO 2A: ASISTENCIA YA REGISTRADA**
                const asistenciaRegistrada = asistenciasLocal.find(a => {
                    const fecha = new Date(a.fecha);
                    return (
                        a.materiaId == materiaActual.id &&
                        a.dia === diaActual &&
                        fecha.toDateString() === ahora.toDateString()
                    );
                });

                const estadoAsistencia = asistenciaRegistrada?.asistio === "si" ? "✅ <b>Sí asististe</b>" : "❌ <b>No asististe</b>";

                mensajeElement.innerHTML = `
                    📝 Asistencia para <b>${materiaActual.nombre}</b> ya registrada: ${estadoAsistencia}<br>
                    ${obtenerMensajeSiguienteClase()}
                `;

                form.onsubmit = (e) => {
                    e.preventDefault();
                    mostrarMensajePersonalizado(`ℹ️ Ya registraste tu asistencia para <b>${materiaActual.nombre}</b> como: ${asistenciaRegistrada?.asistio === "si" ? "Sí asististe" : "No asististe"}.`);
                };
                return;
            }

            // **CASO 2B: CLASE ACTUAL SIN REGISTRAR**
            const tiempoRestante = Math.round((convertirAHorasDecimal(materiaActual.hora_fin) - horaActual) * 60);
            let mensajeClaseActual = `📚 Tienes clase de <b>${materiaActual.nombre}</b> en curso`;

            if (tiempoRestante > 30) {
                mensajeClaseActual += ` (termina en ${Math.floor(tiempoRestante / 60)}h ${tiempoRestante % 60}min)`;
            } else if (tiempoRestante > 0) {
                mensajeClaseActual += ` (termina en ${tiempoRestante} minutos)`;
            } else {
                mensajeClaseActual += ` (ya terminó)`;
            }

            mensajeElement.innerHTML = `${mensajeClaseActual}.<br>❓ <b>¿Ya asististe a esta clase?</b>`;

            form.onsubmit = async (e) => {
                e.preventDefault();
                const seleccion = form.querySelector("input[name='asistio']:checked");
                if (!seleccion) {
                    mostrarMensajePersonalizado("⚠️ Debes seleccionar si asististe o no.");
                    return;
                }

                try {
                    const response = await fetch('Controlador/AsistenciaController.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `materia_id=${materiaActual.id}&asistio=${seleccion.value}&dia=${diaActual}&hora_inicio=${materiaActual.hora_inicio}&hora_fin=${materiaActual.hora_fin}`
                    });

                    const result = await response.json();

                    if (result.error) {
                        mostrarMensajePersonalizado("❌ " + result.error);
                        return;
                    }

                    // Guardar en localStorage
                    const asistenciasLocal = JSON.parse(localStorage.getItem("asistencias")) || [];
                    asistenciasLocal.push({
                        materiaId: materiaActual.id,
                        materiaNombre: materiaActual.nombre,
                        dia: diaActual,
                        hora_inicio: materiaActual.hora_inicio,
                        hora_fin: materiaActual.hora_fin,
                        fecha: new Date().toISOString(),
                        asistio: seleccion.value
                    });
                    localStorage.setItem("asistencias", JSON.stringify(asistenciasLocal));

                    form.reset();

                    // **MENSAJE DINÁMICO DESPUÉS DE REGISTRAR**
                    const estadoRegistrado = seleccion.value === "si" ? "✅ Sí asististe" : "❌ No asististe";
                    const mensajeSiguiente = obtenerMensajeSiguienteClase();

                    mostrarMensajePersonalizado(
                        `🎉 ¡Asistencia registrada correctamente!<br><br>
                        📚 <b>${materiaActual.nombre}</b>: ${estadoRegistrado}<br><br>
                        ${mensajeSiguiente}`
                    );

                    // **ACTUALIZAR LA VISTA DESPUÉS DEL REGISTRO**
                    setTimeout(() => {
                        spanMateria.textContent = materiaActual.nombre;
                        mensajeElement.innerHTML = `
                            📝 Asistencia para <b>${materiaActual.nombre}</b> registrada: ${estadoRegistrado}<br>
                            ${mensajeSiguiente}
                        `;

                        // Cambiar el comportamiento del formulario
                        form.onsubmit = (e) => {
                            e.preventDefault();
                            mostrarMensajePersonalizado(`ℹ️ Ya registraste tu asistencia para <b>${materiaActual.nombre}</b> como: ${seleccion.value === "si" ? "Sí asististe" : "No asististe"}.`);
                        };
                    }, 300);

                } catch (error) {
                    mostrarMensajePersonalizado("❌ Error al registrar asistencia. Verifica tu conexión.");
                    console.error('Error:', error);
                }
            };

        } catch (error) {
            console.error("Error de conexión:", error);
            spanMateria.textContent = "______";
            mensajeElement.innerHTML = "❌ Error de conexión. Verifica tu internet e intenta recargar la página.";
        }
    }

    // Llamar al cargar la página
    actualizarVistaAsistencia();
}

export function initTablaAsistencias() {
    const container = document.querySelector("main");
    const template = document.getElementById("tabla-asistencias");
    const clone = template.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);

    const comboMes = document.getElementById("combo-mes");
    const comboSemana = document.getElementById("combo-semana");
    const btnBuscar = document.getElementById("btn-buscar");

    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    function llenarComboMeses() {
        comboMes.innerHTML = "";
        meses.forEach((mes, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = mes.charAt(0).toUpperCase() + mes.slice(1);
            comboMes.appendChild(option);
        });
    }

    function llenarComboSemanas(mesSeleccionado, anio = new Date().getFullYear()) {
        comboSemana.innerHTML = "";
        const primerDiaMes = new Date(anio, mesSeleccionado, 1);
        let diaSemana = primerDiaMes.getDay();
        let ajuste = 0;
        if (diaSemana !== 1) {
            ajuste = (diaSemana === 0 ? -6 : 1 - diaSemana);
        }
        let inicioSemana = new Date(anio, mesSeleccionado, 1 + ajuste);
        const ultimoDiaMes = new Date(anio, mesSeleccionado + 1, 0);
        while (inicioSemana <= ultimoDiaMes) {
            let finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);
            if (finSemana.getMonth() !== mesSeleccionado) {
                if (finSemana.getMonth() === 0) {
                    finSemana = new Date(anio + 1, 0, finSemana.getDate());
                } else {
                    finSemana = new Date(anio, mesSeleccionado + 1, finSemana.getDate());
                }
            }
            const option = document.createElement("option");
            option.value = `${inicioSemana.getDate()}-${finSemana.getDate()}`;
            option.textContent = `${inicioSemana.getDate()} al ${finSemana.getDate()} (${meses[inicioSemana.getMonth()]})`;
            comboSemana.appendChild(option);
            inicioSemana.setDate(inicioSemana.getDate() + 7);
        }
    }
    // NUEVO: fetch desde PHP
    async function fetchAsistenciasPorSemana(mes, rangoDias, anio) {
        const [diaInicio, diaFin] = rangoDias.split("-").map(Number);
        const opcionSeleccionada = comboSemana.options[comboSemana.selectedIndex].textContent;
        const mesTextoInicio = opcionSeleccionada.match(/\((.*?)\)/)[1];
        const mesInicio = meses.findIndex(m => m.toLowerCase() === mesTextoInicio.toLowerCase());
        let mesReal = mes;
        let anioFin = anio;
        if (mesInicio !== mes) mesReal = mesInicio;
        let fechaInicio = new Date(anio, mesReal, diaInicio);
        let fechaFin;
        if (diaFin < diaInicio && mesReal === mes) {
            const mesFin = (mes + 1) % 12;
            anioFin = mesFin === 0 ? anio + 1 : anio;
            fechaFin = new Date(anioFin, mesFin, diaFin);
        } else if (mesReal !== mes) {
            fechaFin = new Date(anio, mes, diaFin);
        } else {
            fechaFin = new Date(anio, mes, diaFin);
        }
        const fechaIniStr = fechaInicio.toISOString().slice(0, 10);
        const fechaFinStr = fechaFin.toISOString().slice(0, 10);

        // Cambia la ruta según tu estructura
        const res = await fetch(`../Controlador/AsistenciaController.php?fecha_inicio=${fechaIniStr}&fecha_fin=${fechaFinStr}`);
        return await res.json();
    }

    function mostrarAsistenciasFiltradas(asistenciasFiltradas) {
        const tbody = container.querySelector("tbody");
        tbody.innerHTML = "";
        const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
        const materiasAgrupadas = {};

        asistenciasFiltradas.forEach(a => {
            // Normaliza nombre de materia
            const nombreMateria = a.materiaNombre || a.nombre_materia || a.nombre || a.materia_nombre;
            // Normaliza fecha
            let fecha = "-";
            if (a.fecha) {
                const f = new Date(a.fecha);
                fecha = isNaN(f.getTime()) ? a.fecha : f.toLocaleDateString();
            }
            // Normaliza día
            const diaTexto = (a.dia || "").toLowerCase();
            const indiceDia = diasSemana.findIndex(d => d === diaTexto);
            if (indiceDia !== -1) {
                if (!materiasAgrupadas[nombreMateria]) {
                    materiasAgrupadas[nombreMateria] = {};
                }
                const diaSinAcentos = diasSemana[indiceDia];
                if (!materiasAgrupadas[nombreMateria][diaSinAcentos]) {
                    materiasAgrupadas[nombreMateria][diaSinAcentos] = [];
                }
                // Normaliza horario
                const horaIni = a.hora_inicio ? a.hora_inicio.slice(0, 5) : "";
                const horaFin = a.hora_fin ? a.hora_fin.slice(0, 5) : "";
                materiasAgrupadas[nombreMateria][diaSinAcentos].push({
                    fecha,
                    horario: `${horaIni} - ${horaFin}`,
                    icono: a.asistio === "si" ? 
                    "<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'><path fill='none' stroke='#006529' stroke-dasharray='24' stroke-dashoffset='24' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 11l6 6l10 -10'><animate fill='freeze' attributeName='stroke-dashoffset' dur='0.28s' values='24;0'/></path></svg>" : 
                    "<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'><path fill='none' stroke='#dd1b1b' stroke-dasharray='12' stroke-dashoffset='12' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7'><animate fill='freeze' attributeName='stroke-dashoffset' dur='0.21s' values='12;0'/></path></svg>"
                });
            }
        });

        // Crear filas para cada materia
        Object.keys(materiasAgrupadas).forEach(nombre => {
            const fila = document.createElement("tr");
            const tdMateria = document.createElement("td");
            tdMateria.innerHTML = `<strong>${nombre}</strong>`;
            fila.appendChild(tdMateria);

            diasSemana.forEach(dia => {
                const td = document.createElement("td");
                const asistenciasDia = materiasAgrupadas[nombre][dia];
                if (asistenciasDia && asistenciasDia.length > 0) {
                    td.innerHTML = asistenciasDia.map(data =>
                        `${data.icono}<br><small>${data.fecha}</small><br><small>${data.horario}</small>`
                    ).join("<hr>");
                } else {
                    td.innerHTML = "-";
                }
                fila.appendChild(td);
            });
            tbody.appendChild(fila);
        });
    }

    llenarComboMeses();
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    llenarComboSemanas(mesActual, anioActual);

    comboMes.value = mesActual;
    comboMes.addEventListener("change", (e) => {
        llenarComboSemanas(parseInt(e.target.value), anioActual);
    });

    btnBuscar.addEventListener("click", async () => {
        const mes = parseInt(comboMes.value);
        const semana = comboSemana.value;
        const anio = anioActual;
        const filtradas = await fetchAsistenciasPorSemana(mes, semana, anio);
        mostrarAsistenciasFiltradas(filtradas);
    });

    // Selecciona por defecto la semana actual
    const fechaHoy = new Date();
    const dia = fechaHoy.getDate();
    const opciones = comboSemana.options;
    let semanaDefault = opciones[0]?.value || "";
    for (let opt of opciones) {
        const [inicio, fin] = opt.value.split("-").map(Number);
        if (dia >= inicio && dia <= fin) {
            semanaDefault = opt.value;
            break;
        }
    }
    comboSemana.value = semanaDefault;

    // Primer render (async)
    fetchAsistenciasPorSemana(mesActual, semanaDefault, anioActual).then(mostrarAsistenciasFiltradas);
}