import { mostrarMensajePersonalizado, generarIdUnico, horariosSeSolapan } from './utilidades.js';

export function initMaterias() {
    const container = document.querySelector("main");
    const tmpl = document.getElementById("editar-materias");

    // Limpiar el contenedor antes de agregar el nuevo contenido
    const clone = tmpl.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);

    // Asegúrate de que el formulario y el botón cancelar estén presentes en el DOM
    const form = document.getElementById("form-materia");
    const btnCancelar = document.getElementById("cancelar-edicion");

    let materias = JSON.parse(localStorage.getItem("materias")) || [];
    let editandoId = null;
    const tabla = document.getElementById("tabla-materias").querySelector("tbody");

    function renderMaterias() {
        tabla.innerHTML = "";
        materias.forEach(m => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                    <td>${m.nombre}</td>
                    <td>${m.dias.join(", ")}</td>
                    <td>${m.hora_inicio} - ${m.hora_fin}</td>
                    <td>${m.profesor}</td>
                    <td>
                        <button class="eliminar" title="Eliminar materia" style="color:red;font-weight:bold;">&#x2716;</button>
                    </td>
                `;
            fila.addEventListener("click", (e) => {
                if (e.target.classList.contains("eliminar")) return; // No editar si es para eliminar
                form.materia.value = m.nombre;
                [...form.dias.options].forEach(opt => {
                    opt.selected = m.dias.includes(opt.value);
                });
                form.hora_inicio.value = m.hora_inicio;
                form.hora_fin.value = m.hora_fin;
                form.profesor.value = m.profesor;
                editandoId = m.id;
            });
            fila.querySelector(".eliminar").addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`¿Seguro que quieres borrar "${m.nombre}" (${m.hora_inicio}-${m.hora_fin})?`)) {
                    materias = materias.filter(mat => mat.id !== m.id);
                    localStorage.setItem("materias", JSON.stringify(materias));
                    renderMaterias();
                }
            });
            tabla.appendChild(fila);
        });
    }

    // Botón cancelar de edición
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            form.reset();
            editandoId = null;
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = form.materia.value.trim();
        const dias = Array.from(form.dias.selectedOptions).map(opt => opt.value);
        const hora_inicio = form.hora_inicio.value;
        const hora_fin = form.hora_fin.value;
        const profesor = form.profesor.value.trim();

        // Validación de solapamiento
        for (let dia of dias) {
            let conflicto = materias.find(m =>
                m.id !== editandoId &&
                m.dias.includes(dia) &&
                horariosSeSolapan(hora_inicio, hora_fin, m.hora_inicio, m.hora_fin)
            );
            if (conflicto) {
                mostrarMensajePersonalizado(`Ya tienes una materia "<b>${conflicto.nombre}</b>" (${conflicto.hora_inicio} - ${conflicto.hora_fin}) ese día`);
                return;
            }
        }

        if (editandoId) {
            // Editar
            const idx = materias.findIndex(m => m.id === editandoId);
            materias[idx] = { id: editandoId, nombre, dias, hora_inicio, hora_fin, profesor };
            // Actualiza nombre en asistencias
            let asistencias = JSON.parse(localStorage.getItem("asistencias")) || [];
            asistencias = asistencias.map(a => {
                if (a.materiaId === editandoId) {
                    return { ...a, materiaNombre: nombre };
                }
                return a;
            });
            localStorage.setItem("asistencias", JSON.stringify(asistencias));
            editandoId = null;
        } else {
            // Nuevo
            materias.push({ id: generarIdUnico(), nombre, dias, hora_inicio, hora_fin, profesor });
        }
        localStorage.setItem("materias", JSON.stringify(materias));
        mostrarMensajePersonalizado("Materia guardada correctamente");
        renderMaterias();
        form.reset();
    });

    renderMaterias();
}