document.addEventListener("DOMContentLoaded", () => {
    // Activar menú desplegable
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu-desplegable");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });
    }

    // Detectar en qué página estamos para cargar contenido dinámicamente si hay templates
    const path = window.location.pathname;
    let page = path.split("/").pop();
    if (!page || page === "") page = "index.html";
    const templates = {
        "editar_materias.html": "editar-materias",
        "asistencias.html": "tabla-asistencias",
        "resumen.html": "resumen-asistencia"
    };

    const container = document.querySelector("main");
    if (templates[page]) {
        const tpl = document.getElementById(templates[page]);
        if (tpl && container) {
            const clone = tpl.content.cloneNode(true);
            container.innerHTML = ""; // Limpia lo anterior
            container.appendChild(clone);
        }
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.error("Error al registrar el SW", err));
    }

    // Mejora visual para los inputs de asistencia (íconos ✔ ✘)
    const asistenciaForm = document.getElementById("form-asistencia");
    if (asistenciaForm) {
        const radios = asistenciaForm.querySelectorAll("input[type=radio]");
        radios.forEach(radio => {
            const label = radio.parentElement;
            label.style.fontSize = "1.5rem";
            label.style.display = "inline-block";
            label.style.margin = "10px";
            if (radio.value === "si") {
                label.innerHTML = `<input type="radio" name="asistio" value="si" required> ✔ Asistí`;
            } else if (radio.value === "no") {
                label.innerHTML = `<input type="radio" name="asistio" value="no" required> ✘ No asistí`;
            }
        });
    }

    // FUNCIONALIDAD DE TABLAS DE ASISTENCIA Y RESUMEN SE PROGRAMARÁ EN SIGUIENTE PASO

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("show");
        });
    }

    function mostrarMensajePersonalizado(mensaje) {
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

    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    if (materias.length === 0 && page !== "editar_materias.html") {
        mostrarMensajePersonalizado("Todavía no tienes materias registradas. Ve a 'Editar' para agregarlas.");
    }

    if (page === "index.html") {
        const spanMateria = document.getElementById("nombre-materia");
        const form = document.getElementById("form-asistencia");

        const ahora = new Date();

        function quitarAcentos(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function convertirAHorasDecimal(horaStr) {
            const [h, m] = horaStr.split(":").map(Number);
            return h + m / 60;
        }

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
                return (
                    a.materia === materiaActual.nombre &&
                    fecha.toDateString() === ahora.toDateString()
                );
            });

            if (yaRegistrada) {
                document.querySelector("p").textContent = `Ya registraste asistencia para la clase de ${materiaActual.nombre}.`;
                return;
            }

        } else {
            spanMateria.textContent = "______";
            document.querySelector("p").textContent = "No tienes clase en esta hora.";
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
                    a.materia === materiaActual.nombre &&
                    fecha.toDateString() === ahora.toDateString()
                );
            });

            if (yaRegistrada) {
                mostrarMensajePersonalizado("Ya registraste asistencia para esta clase.");
                return;
            }

            // Guardar asistencia
            asistencias.push({
                materia: materiaActual.nombre,
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
                    mensaje += `Tu siguiente clase comienza en ${horas > 0 ? `${horas}h ` : ""}${minutos} minutos.`;
                } else {
                    mensaje += `No tienes más clases pendientes por hoy.`;
                }

                document.querySelector("p").textContent = mensaje;
                spanMateria.textContent = materiaActual.nombre;
            }, 300); // Pequeña espera para que se cierre el modal primero
        });
    }
    if (page === "resumen.html") {
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
                    if (!resumen[a.materia]) resumen[a.materia] = 0;
                    resumen[a.materia]++;
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

    if (page === "asistencias.html") {
        const container = document.querySelector("main");
        const template = document.getElementById("tabla-asistencias");
        const clone = template.content.cloneNode(true);
        container.innerHTML = "";
        container.appendChild(clone);
      
        // Ahora que el contenido está en el DOM, ya existen los elementos
        const comboMes = document.getElementById("combo-mes");
        const comboSemana = document.getElementById("combo-semana");
        const btnBuscar = document.getElementById("btn-buscar");
      
        const meses = ["enero", "febrero", "marzo","abril","mayo","Junio","Julio","agosto", "septiembre","octubre","noviembre", "diciembre"];
      
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
          const ultimoDiaMes = new Date(anio, mesSeleccionado + 1, 0);
          let inicioSemana = new Date(primerDiaMes);
      
          while (inicioSemana <= ultimoDiaMes) {
            let finSemana = new Date(inicioSemana);
            finSemana.setDate(finSemana.getDate() + 6);
            if (finSemana > ultimoDiaMes) finSemana = new Date(ultimoDiaMes);
      
            const option = document.createElement("option");
            option.value = `${inicioSemana.getDate()}-${finSemana.getDate()}`;
            option.textContent = `${inicioSemana.getDate()} al ${finSemana.getDate()}`;
            comboSemana.appendChild(option);
      
            inicioSemana.setDate(inicioSemana.getDate() + 7);
          }
        }
      
        function filtrarAsistenciasPorSemana(mes, rangoDias) {
          const asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
          const [diaInicio, diaFin] = rangoDias.split("-").map(Number);
          return asistencias.filter(a => {
            const fecha = new Date(a.fecha);
            return fecha.getMonth() === mes &&
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
            const dia = diasSemana[fecha.getDay() - 1];
            if (!materiasAgrupadas[a.materia]) materiasAgrupadas[a.materia] = {};
            const hora = fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            materiasAgrupadas[a.materia][dia] = {
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
        llenarComboSemanas(mesActual);
      
        comboMes.value = mesActual;
        comboMes.addEventListener("change", (e) => {
          llenarComboSemanas(parseInt(e.target.value));
        });
      
        btnBuscar.addEventListener("click", () => {
          const mes = parseInt(comboMes.value);
          const semana = comboSemana.value;
          const filtradas = filtrarAsistenciasPorSemana(mes, semana);
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
        const filtradas = filtrarAsistenciasPorSemana(mesActual, semanaDefault);
        mostrarAsistenciasFiltradas(filtradas);
      }


    if (page === "editar_materias.html") {
        console.log("Materias cargadas:", materias);
        const tabla = document.getElementById("tabla-materias").querySelector("tbody");
        const form = document.getElementById("form-materia");

        function renderMaterias() {
            tabla.innerHTML = "";
            materias.forEach((m, i) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td>${m.nombre}</td><td>${m.dias.join(", ")}</td><td>${m.hora_inicio} - ${m.hora_fin}</td><td>${m.profesor}</td>`;
                fila.addEventListener("click", () => {
                    form.materia.value = m.nombre;
                    [...form.dias.options].forEach(opt => {
                        opt.selected = m.dias.includes(opt.value);
                    });
                    form.hora_inicio.value = m.hora_inicio;
                    form.hora_fin.value = m.hora_fin;
                    form.profesor.value = m.profesor;
                });
                tabla.appendChild(fila);
            });
        }

        renderMaterias();

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = form.materia.value;
            const dias = Array.from(form.dias.selectedOptions).map(opt => opt.value);
            const hora_inicio = form.hora_inicio.value;
            const hora_fin = form.hora_fin.value;
            const profesor = form.profesor.value;

            const nuevaMateria = {
                nombre: nombre.trim(),
                dias: dias.map(d => d.toLowerCase()), // Asegúrate de que los días estén en minúsculas
                hora_inicio: hora_inicio.trim(),
                hora_fin: hora_fin.trim(),
                profesor: profesor.trim()
            };
            const index = materias.findIndex(m => m.nombre === nombre);
            if (index !== -1) materias[index] = nuevaMateria;
            else materias.push(nuevaMateria);

            localStorage.setItem("materias", JSON.stringify(materias));
            mostrarMensajePersonalizado("Materia guardada correctamente");
            renderMaterias();
            form.reset();
        });
    }
});
