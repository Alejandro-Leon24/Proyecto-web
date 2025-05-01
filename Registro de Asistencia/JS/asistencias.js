import { mostrarMensajePersonalizado, quitarAcentos, convertirAHorasDecimal } from './utilidades.js';
//Manejo de logica de asistencia para registrarla y mostrarla en la tabla de asistencias

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

    // Buscar materia y horario correspondiente
    let materiaActual = null;
    let horarioActual = null;
    for (let m of materias) {
        if (!m.horarios) continue;
        let h = m.horarios.find(h =>
            h.dia === diaActual &&
            horaActual >= convertirAHorasDecimal(h.hora_inicio) &&
            horaActual <= convertirAHorasDecimal(h.hora_fin)
        );
        if (h) {
            materiaActual = m;
            horarioActual = h;
            break;
        }
    }

    if (materiaActual && horarioActual) {
        spanMateria.textContent = materiaActual.nombre;

        // SOLO comparar por materiaId, dia y fecha para saber si ya hay asistencia hoy
        const yaRegistrada = asistencias.some(a => {
            const fecha = new Date(a.fecha);
            return (
                a.materiaId === materiaActual.id &&
                a.dia === diaActual &&
                fecha.toDateString() === ahora.toDateString()
            );
        });

        if (yaRegistrada) {
            let mensajeYaRegistrada = `Ya registraste asistencia para la clase de ${materiaActual.nombre}. `;

            // Buscar la siguiente clase (adaptado a horarios por día)
            const siguientes = [];
            for (let m of materias) {
                if (!m.horarios) continue;
                for (let h of m.horarios) {
                    if (h.dia === diaActual && convertirAHorasDecimal(h.hora_inicio) > horaActual) {
                        siguientes.push({ materia: m, horario: h });
                    }
                }
            }
            siguientes.sort((a, b) =>
                convertirAHorasDecimal(a.horario.hora_inicio) - convertirAHorasDecimal(b.horario.hora_inicio)
            );

            if (siguientes.length > 0) {
                const siguiente = siguientes[0];
                const mins = Math.round((convertirAHorasDecimal(siguiente.horario.hora_inicio) - horaActual) * 60);
                const horas = Math.floor(mins / 60);
                const minutos = mins % 60;
                mensajeYaRegistrada += `Tu siguiente clase, ${siguiente.materia.nombre}, comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos.`;
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

        // SOLO comparar por materiaId, dia, fecha para evitar duplicados aunque cambie el horario
        const yaRegistrada = asistencias.some(a => {
            const fecha = new Date(a.fecha);
            return (
                a.materiaId === materiaActual.id &&
                a.dia === diaActual &&
                fecha.toDateString() === ahora.toDateString()
            );
        });

        if (yaRegistrada) {
            mostrarMensajePersonalizado("Ya registraste asistencia para esta clase.");
            return;
        }

        // Guardar asistencia (puedes seguir guardando el horario para referencia/histórico)
        asistencias.push({
            materiaId: materiaActual.id,
            materiaNombre: materiaActual.nombre, // Para mostrar
            dia: diaActual,
            hora_inicio: horarioActual.hora_inicio,
            hora_fin: horarioActual.hora_fin,
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
            const siguientes = [];
            for (let m of materias) {
                if (!m.horarios) continue;
                for (let h of m.horarios) {
                    if (h.dia === diaActual && convertirAHorasDecimal(h.hora_inicio) > horaActual) {
                        siguientes.push({ materia: m, horario: h });
                    }
                }
            }
            siguientes.sort((a, b) =>
                convertirAHorasDecimal(a.horario.hora_inicio) - convertirAHorasDecimal(b.horario.hora_inicio)
            );

            let mensaje = `Ya registraste asistencia para la clase de ${materiaActual.nombre}. `;
            if (siguientes.length > 0) {
                const siguiente = siguientes[0];
                const mins = Math.round((convertirAHorasDecimal(siguiente.horario.hora_inicio) - horaActual) * 60);
                const horas = Math.floor(mins / 60);
                const minutos = mins % 60;
                mensaje += `Tu siguiente clase, ${siguiente.materia.nombre}, comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos.`;
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
        let diaSemana = primerDiaMes.getDay(); // 0 (domingo) - 6 (sábado)
        let ajuste = 0;
    
        if (diaSemana !== 1) { // Si no es lunes
            ajuste = (diaSemana === 0 ? -6 : 1 - diaSemana); // Ajuste para llegar al lunes anterior
        }
    
        let inicioSemana = new Date(primerDiaMes.getFullYear(), primerDiaMes.getMonth(), primerDiaMes.getDate() + ajuste);
        const ultimoDiaMes = new Date(anio, mesSeleccionado + 1, 0);
    
        while (inicioSemana <= ultimoDiaMes) {
            let finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);
    
            // Si finSemana cruza al siguiente mes, ajustamos el mes y posiblemente el año
            if (finSemana.getMonth() !== mesSeleccionado) {
                if (finSemana.getMonth() === 0) { // Si cruzamos de diciembre a enero
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

    function filtrarAsistenciasPorSemana(mes, rangoDias, anio) {
        const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
        const [diaInicio, diaFin] = rangoDias.split("-").map(Number);
        
        // Obtenemos el texto de la opción seleccionada para determinar el mes real de inicio
        const opcionSeleccionada = comboSemana.options[comboSemana.selectedIndex].textContent;
        const mesTextoInicio = opcionSeleccionada.match(/\((.*?)\)/)[1]; // Extrae el mes entre paréntesis
        
        // Encontrar el índice del mes de inicio basado en el texto
        const mesInicio = meses.findIndex(m => 
            m.toLowerCase() === mesTextoInicio.toLowerCase());
        
        // Determinar si la semana cruza al mes siguiente o al mes anterior
        let mesReal = mes;
        let mesFin = mes;
        
        // Si el mes del texto de la opción no coincide con el mes seleccionado,
        // significa que estamos viendo una semana que comenzó en otro mes
        if (mesInicio !== mes) {
            mesReal = mesInicio;
        }
        
        // Calcular la fecha completa de inicio basada en el mes real
        const inicioSemana = new Date(anio, mesReal, diaInicio);
        
        // Si diaFin < diaInicio, significa que la semana termina en el mes siguiente
        if (diaFin < diaInicio && mesReal === mes) {
            mesFin = (mes + 1) % 12;
            // Si cruzamos de diciembre a enero, incrementamos el año
            const anioFin = mesFin === 0 ? anio + 1 : anio;
            var finSemana = new Date(anioFin, mesFin, diaFin);
        } 
        // Si mesReal !== mes, significa que la semana comienza en el mes anterior
        else if (mesReal !== mes) {
            // La fecha de fin está en el mes seleccionado (mes)
            var finSemana = new Date(anio, mes, diaFin);
        } 
        // Caso normal: la semana está completamente dentro del mes
        else {
            var finSemana = new Date(anio, mes, diaFin);
        }
        
        // Filtrar asistencias dentro del rango completo
        return asistencias.filter(a => {
            const fecha = new Date(a.fecha);
            return fecha >= inicioSemana && fecha <= finSemana;
        });
    }

    function mostrarAsistenciasFiltradas(asistenciasFiltradas) {
        const tbody = container.querySelector("tbody");
        tbody.innerHTML = "";
        const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
        const diasSemanaDisplay = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
        const materiasAgrupadas = {};

        asistenciasFiltradas.forEach(a => {
            const fecha = new Date(a.fecha);
            
            // Obtenemos el día almacenado (que viene sin acentos debido a quitarAcentos())
            const diaTexto = a.dia;
            
            // Encontrar el índice del día para luego usar el display correspondiente
            const indiceDia = diasSemana.findIndex(d => 
                d.toLowerCase() === diaTexto.toLowerCase());
                
            console.log(`Fecha: ${fecha.toLocaleDateString()}, Día: ${diaTexto}, Índice encontrado: ${indiceDia}`);
            
            if (indiceDia !== -1) {
                // Inicializamos las estructuras si no existen
                if (!materiasAgrupadas[a.materiaNombre]) {
                    materiasAgrupadas[a.materiaNombre] = {};
                }
                
                // Usamos el día sin acentos para agrupar internamente
                const diaSinAcentos = diasSemana[indiceDia];
                if (!materiasAgrupadas[a.materiaNombre][diaSinAcentos]) {
                    materiasAgrupadas[a.materiaNombre][diaSinAcentos] = [];
                }
                
                // Añadimos la entrada
                materiasAgrupadas[a.materiaNombre][diaSinAcentos].push({
                    fecha: fecha.toLocaleDateString(),
                    horario: `${a.hora_inicio} - ${a.hora_fin}`,
                    icono: a.asistio === "si" ? "✔" : "✘"
                });
            } else {
                console.warn(`¡No se encontró el día "${diaTexto}" en el array de días!`);
            }
        });
    
        // Crear filas para cada materia
        Object.keys(materiasAgrupadas).forEach(nombre => {
            const fila = document.createElement("tr");
            const tdMateria = document.createElement("td");
            tdMateria.innerHTML = `<strong>${nombre}</strong>`;
            fila.appendChild(tdMateria);
    
            // Crear celdas para cada día de la semana
            diasSemana.forEach((dia, index) => {
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

    btnBuscar.addEventListener("click", () => {
        const mes = parseInt(comboMes.value);
        const semana = comboSemana.value;
        const anio = new Date().getFullYear();
        const filtradas = filtrarAsistenciasPorSemana(mes, semana, anio);
        mostrarAsistenciasFiltradas(filtradas);
    });

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