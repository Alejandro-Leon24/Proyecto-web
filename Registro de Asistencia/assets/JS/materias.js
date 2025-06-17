import {horariosSeSolapan } from './utilidades.js';

export function initMaterias() {
    const form = document.getElementById("form-materia");
    if (!form) return;

    const diasSelect = form.querySelector("select[name='dias[]']");
    const horariosOriginal = `
        <div id="horarios-por-dia">
            <label>Hora de inicio: <input type="time" disabled></label>
            <label>Hora de fin: <input type="time" disabled></label>
            <small>Selecciona un día para establecer el horario</small>
        </div>`;

    let horariosContainer = form.querySelector("#horarios-por-dia");
    if (!horariosContainer) {
        horariosContainer = document.createElement("div");
        horariosContainer.id = "horarios-por-dia";
        form.insertBefore(horariosContainer, form.querySelector("label[for='profesor']") || form.querySelector("button"));
        horariosContainer.innerHTML = horariosOriginal;
    }

    diasSelect.addEventListener("change", function () {
        const diasSeleccionados = Array.from(diasSelect.selectedOptions).map(opt => opt.value);
        if (diasSeleccionados.length === 0) {
            horariosContainer.innerHTML = horariosOriginal;
        } else {
            horariosContainer.innerHTML = "";
            diasSeleccionados.forEach(dia => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <h3>Horario para ${dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
                    <label>Hora de inicio:
                        <input type="time" name="hora_inicio_${dia}" required>
                    </label>
                    <label>Hora de fin:
                        <input type="time" name="hora_fin_${dia}" required>
                    </label>
                `;
                horariosContainer.appendChild(div);
            });
        }
    });

    form.addEventListener("submit", function (e) {
        // Validación campos
        const nombre = form.materia.value.trim();
        const profesor = form.profesor.value.trim();
        const dias = Array.from(diasSelect.selectedOptions).map(opt => opt.value);

        if (!nombre) {
            e.preventDefault();
            alert("El nombre de la materia es obligatorio.");
            return false;
        }

        if (!profesor) {
            e.preventDefault();
            alert("El nombre del profesor es obligatorio.");
            return false;
        }

        if (dias.length === 0) {
            e.preventDefault();
            alert("Selecciona al menos un día.");
            return false;
        }

        // Validar cada horario
        let horarios = [];
        for (let dia of dias) {
            const hora_inicio = form.querySelector(`input[name='hora_inicio_${dia}']`)?.value;
            const hora_fin = form.querySelector(`input[name='hora_fin_${dia}']`)?.value;
            if (!hora_inicio || !hora_fin) {
                e.preventDefault();
                alert(`Faltan horarios para ${dia}.`);
                return false;
            }
            if (hora_inicio >= hora_fin) {
                e.preventDefault();
                alert(`La hora de inicio debe ser menor a la de fin para ${dia}.`);
                return false;
            }
            horarios.push({ dia, hora_inicio, hora_fin });
        }

        // Validación de solapamiento de horarios en el mismo envío
        for (let i = 0; i < horarios.length; i++) {
            for (let j = i + 1; j < horarios.length; j++) {
                if (horarios[i].dia === horarios[j].dia &&
                    horariosSeSolapan(
                        horarios[i].hora_inicio, horarios[i].hora_fin,
                        horarios[j].hora_inicio, horarios[j].hora_fin
                    )
                ) {
                    e.preventDefault();
                    alert(`Los horarios para ${horarios[i].dia} se solapan.`);
                    return false;
                }
            }
        }
        // Si todo bien, el form se envía normalmente
    });

    // Botón cancelar
    const btnCancelar = document.querySelector(".cancelar-edicion");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            form.reset();
            horariosContainer.innerHTML = horariosOriginal;
        });
    }
}