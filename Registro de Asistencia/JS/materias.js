import { mostrarMensajePersonalizado, generarIdUnico, horariosSeSolapan } from './utilidades.js';
export function initMaterias() {
    const container = document.querySelector("main");
    const tmpl = document.getElementById("editar-materias");

    // Limpiar el contenedor antes de agregar el nuevo contenido
    const clone = tmpl.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);

    const form = document.getElementById("form-materia");
    const diasSelect = form.querySelector("select[name='dias']");
    // Backup del HTML original de horarios (los de ejemplo)
    const horariosOriginal = form.querySelector("#horarios-por-dia")
        ? form.querySelector("#horarios-por-dia").innerHTML
        : `
        <div id="horarios-por-dia">
            <label>Hora de inicio: <input type="time" name="hora_inicio_ejemplo" disabled></label>
            <label>Hora de fin: <input type="time" name="hora_fin_ejemplo" disabled></label>
            <small>Selecciona un día para establecer el horario</small>
        </div>`;

    // Crea el contenedor si no existe (primera vez)
    let horariosContainer = form.querySelector("#horarios-por-dia");
    if (!horariosContainer) {
        horariosContainer = document.createElement("div");
        horariosContainer.id = "horarios-por-dia";
        form.insertBefore(horariosContainer, form.querySelector("label[for='profesor']") || form.querySelector("button"));
        horariosContainer.innerHTML = horariosOriginal;
    }

    const btnCancelar = document.querySelector(".cancelar-edicion");

    let materias = JSON.parse(localStorage.getItem("materias")) || [];
    let editandoId = null;
    const tabla = document.getElementById("tabla-materias").querySelector("tbody");

    function renderMaterias() {
        tabla.innerHTML = "";
        materias.forEach(m => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${m.nombre}</td>
                <td>${m.horarios.map(h => h.dia).join(", ")}</td>
                <td>${m.horarios.map(h => `${h.hora_inicio} - ${h.hora_fin}`).join("<br>")}</td>
                <td>${m.profesor}</td>
                <td><button class="eliminar" title="Eliminar materia" style="color:red;font-weight:bold;">&#x2716;</button></td>
            `;
            fila.addEventListener("click", (e) => {
                if (e.target.classList.contains("eliminar")) return;
                form.materia.value = m.nombre;
                [...diasSelect.options].forEach(opt => {
                    opt.selected = m.horarios.some(h => h.dia === opt.value);
                });
                actualizarHorariosInputs(m.horarios);
                form.profesor.value = m.profesor;
                editandoId = m.id;
            });
            fila.querySelector(".eliminar").addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`¿Seguro que quieres borrar "${m.nombre}"?`)) {
                    // 1. Remueve la materia
                    materias = materias.filter(mat => mat.id !== m.id);
                    localStorage.setItem("materias", JSON.stringify(materias));
                    // 2. Remueve asistencias asociadas
                    let asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
                    asistencias = asistencias.filter(a => a.materiaId !== m.id);
                    localStorage.setItem("asistencias", JSON.stringify(asistencias));
                    // 3. Refresca tabla
                    renderMaterias();
                    mostrarMensajePersonalizado(`Materia "${m.nombre}" borrada correctamente.`);
                }
            });
            tabla.appendChild(fila);
        });
    }

    function actualizarHorariosInputs(existingHorarios = []) {
        const diasSeleccionados = Array.from(diasSelect.selectedOptions).map(opt => opt.value);

        if (diasSeleccionados.length === 0) {
            horariosContainer.innerHTML = horariosOriginal;
            return;
        }
        horariosContainer.innerHTML = "";
        diasSeleccionados.forEach(dia => {
            const existente = existingHorarios.find(h => h.dia === dia);
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>Horario para ${dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
                <label>Hora de inicio:
                    <input type="time" name="hora_inicio_${dia}" value="${existente ? existente.hora_inicio : ""}" required>
                </label>
                <label>Hora de fin:
                    <input type="time" name="hora_fin_${dia}" value="${existente ? existente.hora_fin : ""}" required>
                </label>
            `;
            horariosContainer.appendChild(div);
        });
    }

    diasSelect.addEventListener("change", () => {
        actualizarHorariosInputs();
    });

    // Botón cancelar de edición
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            form.reset();
            horariosContainer.innerHTML = horariosOriginal;
            editandoId = null;
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = form.materia.value.trim();
        const profesor = form.profesor.value.trim();

        if (!nombre) {
            mostrarMensajePersonalizado("El nombre de la materia es obligatorio.");
            return;
        }

        const horarios = Array.from(diasSelect.selectedOptions).map(opt => {
            const dia = opt.value;
            const hora_inicio = form.querySelector(`input[name='hora_inicio_${dia}']`)?.value;
            const hora_fin = form.querySelector(`input[name='hora_fin_${dia}']`)?.value;

            if (!hora_inicio || !hora_fin) {
                mostrarMensajePersonalizado(`Faltan horarios para ${dia}`);
                throw new Error(`Faltan horarios para ${dia}`);
            }
            return { dia, hora_inicio, hora_fin };
        });

        // Validación de solapamiento por cada día y horario propuesto
        for (let { dia, hora_inicio, hora_fin } of horarios) {
            let conflicto = materias.find(m =>
                m.id !== editandoId &&
                m.horarios.some(h =>
                    h.dia === dia &&
                    horariosSeSolapan(hora_inicio, hora_fin, h.hora_inicio, h.hora_fin)
                )
            );
            if (conflicto) {
                // Busca el horario específico que solapa, para mostrarlo en el mensaje
                const horarioConflicto = conflicto.horarios.find(h =>
                    h.dia === dia &&
                    horariosSeSolapan(hora_inicio, hora_fin, h.hora_inicio, h.hora_fin)
                );
                mostrarMensajePersonalizado(
                    `Ya tienes una materia "<b>${conflicto.nombre}</b>" ` +
                    `(${horarioConflicto.hora_inicio} - ${horarioConflicto.hora_fin}) ese día (${dia}).`
                );
                return;
            }
        }

        if (editandoId) {
            const idx = materias.findIndex(m => m.id === editandoId);
            materias[idx] = { id: editandoId, nombre, horarios, profesor };
            editandoId = null;
        } else {
            materias.push({ id: generarIdUnico(), nombre, horarios, profesor });
        }
        localStorage.setItem("materias", JSON.stringify(materias));
        mostrarMensajePersonalizado("Materia guardada correctamente");
        renderMaterias();
        form.reset();
        horariosContainer.innerHTML = horariosOriginal;
    });

    renderMaterias();
}