    <script>
    // JS para autocompletar la edición al hacer click en la tabla
    document.addEventListener("DOMContentLoaded", function () {
        const tabla = document.getElementById("tabla-materias");
        const form = document.getElementById("form-materia");
        const diasSelect = document.getElementById("dias-select");
        const horariosDiv = document.getElementById("horarios-por-dia");
        const cancelarBtn = document.getElementById("cancelar-btn");

        tabla.querySelectorAll("tbody tr").forEach((tr, idx) => {
            tr.addEventListener("click", function (e) {
                if (e.target.tagName === "BUTTON") return; // No editar si es el botón eliminar
                // Extrae datos de la fila
                const tds = tr.querySelectorAll("td");
                form['accion'].value = "editar";
                form['materia_id'].value = <?= json_encode(array_column($materias, 'id')) ?>[idx];
                form['nombre-materia'].value = tds[0].textContent;
                // Selecciona días
                const dias = tds[1].textContent.split(",").map(d => d.trim().toLowerCase());
                Array.from(diasSelect.options).forEach(opt => {
                    opt.selected = dias.includes(opt.value);
                });
                // Cargar horarios
                horariosDiv.innerHTML = "";
                const horas = tds[2].innerHTML.split("<br>");
                dias.forEach((dia, i) => {
                    const hora = horas[i] || "";
                    const [inicio, fin] = hora.split("-").map(h => h.trim());
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>Horario para ${dia.charAt(0).toUpperCase()+dia.slice(1)}</h3>
                        <label>Hora de inicio:
                            <input type="time" name="hora_inicio_${dia}" value="${inicio||""}" required>
                        </label>
                        <label>Hora de fin:
                            <input type="time" name="hora_fin_${dia}" value="${fin||""}" required>
                        </label>
                    `;
                    horariosDiv.appendChild(div);
                });
                form['profesor'].value = tds[3].textContent;
            });
        });

        cancelarBtn.addEventListener("click", function () {
            form.reset();
            form['accion'].value = "agregar";
            form['materia_id'].value = "";
            horariosDiv.innerHTML = `<div>
                <label>Hora de inicio: <input type="time" disabled></label>
                <label>Hora de fin: <input type="time" disabled></label>
                <small>Selecciona un día para establecer el horario</small>
            </div>`;
        });

        // Al cambiar días, actualizar inputs de horario
        diasSelect.addEventListener("change", function () {
            const dias = Array.from(diasSelect.selectedOptions).map(opt => opt.value);
            horariosDiv.innerHTML = "";
            if (dias.length === 0) {
                horariosDiv.innerHTML = `<div>
                    <label>Hora de inicio: <input type="time" disabled></label>
                    <label>Hora de fin: <input type="time" disabled></label>
                    <small>Selecciona un día para establecer el horario</small>
                </div>`;
            } else {
                dias.forEach(dia => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>Horario para ${dia.charAt(0).toUpperCase()+dia.slice(1)}</h3>
                        <label>Hora de inicio:
                            <input type="time" name="hora_inicio_${dia}" required>
                        </label>
                        <label>Hora de fin:
                            <input type="time" name="hora_fin_${dia}" required>
                        </label>
                    `;
                    horariosDiv.appendChild(div);
                });
            }
        });
    });
    </script>