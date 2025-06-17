import { mostrarMensajePersonalizado, quitarAcentos, convertirAHorasDecimal } from './utilidades.js';

export function initRegistroAsistencia() {
    const spanMateria = document.getElementById("nombre-materia");
    const mensajeElement = document.querySelector("p");
    const form = document.getElementById("form-asistencia");

    function actualizarVistaAsistencia() {
        const ahora = new Date();
        const diaActual = quitarAcentos(
            ahora.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase()
        );
        const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

        const materias = JSON.parse(localStorage.getItem("materias")) || [];
        const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];

        // Buscar materia y horario correspondiente
        let materiaActual = null;
        let horarioActual = null;
        let siguientes = [];

        for (let m of materias) {
            if (!m.horarios) continue;
            for (let h of m.horarios) {
                if (h.dia === diaActual) {
                    const hInicio = convertirAHorasDecimal(h.hora_inicio);
                    const hFin = convertirAHorasDecimal(h.hora_fin);
                    if (horaActual >= hInicio && horaActual <= hFin) {
                        materiaActual = m;
                        horarioActual = h;
                    } else if (hInicio > horaActual) {
                        siguientes.push({ materia: m, horario: h });
                    }
                }
            }
        }

        siguientes.sort((a, b) =>
            convertirAHorasDecimal(a.horario.hora_inicio) - convertirAHorasDecimal(b.horario.hora_inicio)
        );

        function mensajeSiguienteClase() {
            if (siguientes.length > 0) {
                const siguiente = siguientes[0];
                const mins = Math.round((convertirAHorasDecimal(siguiente.horario.hora_inicio) - horaActual) * 60);
                const horas = Math.floor(mins / 60);
                const minutos = mins % 60;
                return `Tu siguiente clase, <b>${siguiente.materia.nombre}</b>, comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos (${siguiente.horario.hora_inicio}).`;
            } else {
                return `No tienes más clases pendientes por hoy.`;
            }
        }

        // Sin clase actual
        if (!materiaActual || !horarioActual) {
            spanMateria.textContent = "______";
            mensajeElement.innerHTML = "No tienes clase en esta hora.<br>" + mensajeSiguienteClase();
            form.onsubmit = (e) => {
                e.preventDefault();
                mostrarMensajePersonalizado("No puedes registrar asistencia si no tienes clase ahora.");
            };
            return;
        }

        // Clase actual: ¿Ya registrada?
        const yaRegistrada = asistencias.some(a => {
            const fecha = new Date(a.fecha);
            return (
                a.materiaId === materiaActual.id &&
                a.dia === diaActual &&
                fecha.toDateString() === ahora.toDateString()
            );
        });

        spanMateria.textContent = materiaActual.nombre;

        if (yaRegistrada) {
            mensajeElement.innerHTML = `Ya registraste asistencia para la clase de <b>${materiaActual.nombre}</b>.<br>${mensajeSiguienteClase()}`;
            form.onsubmit = (e) => {
                e.preventDefault();
                mostrarMensajePersonalizado(`Ya registraste asistencia para la clase de ${materiaActual.nombre}.`);
            };
            return;
        }

        // Si aún no se ha registrado asistencia
        mensajeElement.innerHTML = `¿Ya asististe a la clase <span id="nombre-materia">${materiaActual.nombre}</span>?`;
        form.onsubmit = (e) => {
            e.preventDefault();
            const seleccion = form.querySelector("input[name='asistio']:checked");
            if (!seleccion) {
                mostrarMensajePersonalizado("Debes seleccionar si asististe o no.");
                return;
            }

            // Verifica de nuevo por si acaso (anti doble click)
            const asistenciasActualizadas = JSON.parse(localStorage.getItem("asistencias")) || [];
            const yaRegistradaAhora = asistenciasActualizadas.some(a => {
                const fecha = new Date(a.fecha);
                return (
                    a.materiaId === materiaActual.id &&
                    a.dia === diaActual &&
                    fecha.toDateString() === ahora.toDateString()
                );
            });
            if (yaRegistradaAhora) {
                mostrarMensajePersonalizado(`Ya registraste asistencia para la clase de ${materiaActual.nombre}.`);
                actualizarVistaAsistencia(); // Refresca la vista
                return;
            }

            // Guardar asistencia
            asistenciasActualizadas.push({
                materiaId: materiaActual.id,
                materiaNombre: materiaActual.nombre,
                dia: diaActual,
                hora_inicio: horarioActual.hora_inicio,
                hora_fin: horarioActual.hora_fin,
                fecha: new Date().toISOString(),
                asistio: seleccion.value
            });
            localStorage.setItem("asistencias", JSON.stringify(asistenciasActualizadas));
            form.reset();

            // Mensaje claro y actualizado
            mostrarMensajePersonalizado(
                `¡Asistencia para <b>${materiaActual.nombre}</b> registrada como: <b>${seleccion.value === "si" ? "Sí" : "No"}</b>!<br>${mensajeSiguienteClase()}`
            );

            // Refresca la vista (para que el mensaje de fondo también cambie)
            setTimeout(actualizarVistaAsistencia, 300);
        };
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
                    icono: a.asistio === "si" ? "✔" : "✘"
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