import { mostrarMensajePersonalizado, quitarAcentos, convertirAHorasDecimal } from './utilidades.js';

export function initRegistroAsistencia() {
    const spanMateria = document.getElementById("nombre-materia");
    const mensajeElement = document.querySelector("p");
    const form = document.getElementById("form-asistencia");

    const ahora = new Date();

    const diaActual = quitarAcentos(
        ahora.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase()
    );
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];

    let materiaActual = materias.find(m =>
        m.dias.includes(diaActual) &&
        horaActual >= convertirAHorasDecimal(m.hora_inicio) &&
        horaActual <= convertirAHorasDecimal(m.hora_fin)
    );

    if (materiaActual) {
        spanMateria.textContent = materiaActual.nombre;

        const yaRegistrada = asistencias.some(a => {
            const fecha = new Date(a.fecha);
            return a.materiaId === materiaActual.id &&
                fecha.toDateString() === ahora.toDateString();
        });

        if (yaRegistrada) {
            let mensajeYaRegistrada = `Ya registraste asistencia para la clase de ${materiaActual.nombre}. `;

            // Buscar la siguiente clase
            const siguientes = materias
                .filter(m =>
                    m.dias.includes(diaActual) &&
                    convertirAHorasDecimal(m.hora_inicio) > horaActual
                )
                .sort((a, b) => convertirAHorasDecimal(a.hora_inicio) - convertirAHorasDecimal(b.hora_inicio));

            if (siguientes.length > 0) {
                const siguiente = siguientes[0];
                const mins = Math.round((convertirAHorasDecimal(siguiente.hora_inicio) - horaActual) * 60);
                const horas = Math.floor(mins / 60);
                const minutos = mins % 60;
                mensajeYaRegistrada += `Tu siguiente clase, ${siguiente.nombre}, comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos.`;
            } else {
                mensajeYaRegistrada += `No tienes más clases pendientes por hoy.`;
            }

            mensajeElement.textContent = mensajeYaRegistrada;
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                mostrarMensajePersonalizado(mensajeYaRegistrada);
            });
            return;
        }

    } else {
        spanMateria.textContent = "______";
        mensajeElement.textContent = "No tienes clase en esta hora.";
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarMensajePersonalizado("No puedes registrar asistencia si no tienes clase ahora.");
        });
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const seleccion = form.querySelector("input[name='asistio']:checked");
        if (!seleccion) {
            mostrarMensajePersonalizado("Debes seleccionar si asististe o no.");
            return;
        }

        // Verificar si ya registró asistencia para esta materia hoy
        const yaRegistrada = asistencias.some(a => {
            const fecha = new Date(a.fecha);
            return (
                a.materiaNombre === materiaActual.nombre &&
                fecha.toDateString() === ahora.toDateString()
            );
        });

        if (yaRegistrada) {
            mostrarMensajePersonalizado("Ya registraste asistencia para esta clase.");
            return;
        }

        // Guardar asistencia
        asistencias.push({
            materiaId: materiaActual.id,
            materiaNombre: materiaActual.nombre, // Para mostrar
            fecha: new Date().toISOString(),
            asistio: seleccion.value
        });
        localStorage.setItem("asistencias", JSON.stringify(asistencias));

        // Resetear selección
        form.reset();

        // Mensaje de confirmación
        mostrarMensajePersonalizado(`Asistencia para ${materiaActual.nombre} registrada como: ${seleccion.value}`);

        // Actualizar mensaje después del modal
        setTimeout(() => {
            const siguientes = materias
                .filter(m =>
                    m.dias.includes(diaActual) &&
                    convertirAHorasDecimal(m.hora_inicio) > horaActual
                )
                .sort((a, b) => convertirAHorasDecimal(a.hora_inicio) - convertirAHorasDecimal(b.hora_inicio));

            let mensaje = `Ya registraste asistencia para la clase de ${materiaActual.nombre}. `;
            if (siguientes.length > 0) {
                const siguiente = siguientes[0];
                const mins = Math.round((convertirAHorasDecimal(siguiente.hora_inicio) - horaActual) * 60);
                const horas = Math.floor(mins / 60);
                const minutos = mins % 60;
                mensaje += `Tu siguiente clase, ${siguiente.nombre}, comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos.`;
            } else {
                mensaje += `No tienes más clases pendientes por hoy.`;
            }

            mensajeElement.textContent = mensaje;
            spanMateria.textContent = materiaActual.nombre;
        }, 300); // Pequeña espera para que se cierre el modal primero
    });
}

export function initTablaAsistencias() {
    const container = document.querySelector("main");
    const template = document.getElementById("tabla-asistencias");
    const clone = template.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);

    // Ahora que el contenido está en el DOM, ya existen los elementos
    const comboMes = document.getElementById("combo-mes");
    const comboSemana = document.getElementById("combo-semana");
    const btnBuscar = document.getElementById("btn-buscar");

    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "Junio", "Julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

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
        let diaSemana = primerDiaMes.getDay();  // 0 (domingo) - 6 (sábado)
        let ajuste = 0;

        if (diaSemana !== 1) { // Si no es lunes
            ajuste = (diaSemana === 0 ? -6 : 1 - diaSemana); // Ajuste para llegar al lunes anterior
        }

        let inicioSemana = new Date(primerDiaMes.getFullYear(), primerDiaMes.getMonth(), primerDiaMes.getDate() + ajuste);
        const ultimoDiaMes = new Date(anio, mesSeleccionado + 1, 0);

        while (inicioSemana <= ultimoDiaMes) {
            let finSemana = new Date(inicioSemana.getFullYear(), inicioSemana.getMonth(), inicioSemana.getDate());
            finSemana.setDate(inicioSemana.getDate() + 6);

            if (finSemana > ultimoDiaMes) {
                finSemana = new Date(ultimoDiaMes.getFullYear(), ultimoDiaMes.getMonth(), ultimoDiaMes.getDate());
            }

            const option = document.createElement("option");
            option.value = `${inicioSemana.getDate()}-${finSemana.getDate()}`;
            option.textContent = `${inicioSemana.getDate()} al ${finSemana.getDate()}`;
            comboSemana.appendChild(option);

            inicioSemana.setDate(inicioSemana.getDate() + 7);
        }
    }

    function filtrarAsistenciasPorSemana(mes, rangoDias, anio) {
        const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
        const [diaInicio, diaFin] = rangoDias.split("-").map(Number);
        return asistencias.filter(a => {
            const fecha = new Date(a.fecha);
            return fecha.getMonth() === mes &&
                fecha.getFullYear() === anio &&
                fecha.getDate() >= diaInicio &&
                fecha.getDate() <= diaFin;
        });
    }

    function mostrarAsistenciasFiltradas(asistenciasFiltradas) {
        const tbody = container.querySelector("tbody");
        tbody.innerHTML = "";
        const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
        const materiasAgrupadas = {};

        asistenciasFiltradas.forEach(a => {
            const fecha = new Date(a.fecha);
            const dia = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][fecha.getDay()];
            if (!materiasAgrupadas[a.materiaNombre]) materiasAgrupadas[a.materiaNombre] = {};
            const hora = fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            materiasAgrupadas[a.materiaNombre][dia] = {
                fecha: fecha.toLocaleDateString(),
                hora,
                icono: a.asistio === "si" ? "✔" : "✘"
            };
        });

        Object.keys(materiasAgrupadas).forEach(nombre => {
            const fila = document.createElement("tr");
            const tdMateria = document.createElement("td");
            tdMateria.innerHTML = `<strong>${nombre}</strong>`;
            fila.appendChild(tdMateria);

            diasSemana.forEach(dia => {
                const td = document.createElement("td");
                const data = materiasAgrupadas[nombre][dia];
                td.innerHTML = data ? `${data.icono}<br><small>${data.fecha}</small><br><small>${data.hora}</small>` : "-";
                fila.appendChild(td);
            });
            tbody.appendChild(fila);
        });
    }

    // Inicializar combos
    llenarComboMeses();
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    llenarComboSemanas(mesActual, anioActual);

    comboMes.value = mesActual;
    comboMes.addEventListener("change", (e) => {
        llenarComboSemanas(parseInt(e.target.value), anioActual);
    });

    btnBuscar.addEventListener("click", () => {
        const mes = parseInt(comboMes.value);
        const semana = comboSemana.value;
        const anio = new Date().getFullYear();
        const filtradas = filtrarAsistenciasPorSemana(mes, semana, anio);
        mostrarAsistenciasFiltradas(filtradas);
    });

    // Mostrar semana actual
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
    const filtradas = filtrarAsistenciasPorSemana(mesActual, semanaDefault, anioActual);
    mostrarAsistenciasFiltradas(filtradas);
}