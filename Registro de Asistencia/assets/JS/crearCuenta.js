export function initCrearCuenta() {
const form = document.querySelector("form[method='post']");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        // Validar campos antes de enviar
        const nombre = form.nombre.value.trim();
        const correo = form.correo.value.trim();
        const contraseña = form.contraseña.value.trim();
        const fechaNacimiento = form.fechaNacimiento.value;

        // Validación simple
        if (!nombre || !correo || !contraseña || !fechaNacimiento) {
            event.preventDefault();
            alert("Todos los campos son obligatorios.");
            return false;
        }

        if (!validateEmail(correo)) {
            event.preventDefault();
            alert("El correo ingresado no es válido.");
            return false;
        }

        if (contraseña.length < 6) {
            event.preventDefault();
            alert("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }

        // Si pasaron todas las validaciones, el formulario se envía normalmente
    });

    // Validar conexión antes de enviar
    form.addEventListener("submit", function (event) {
        if (!navigator.onLine) {
            event.preventDefault();
            alert("No tienes conexión a internet. No puedes crear tu cuenta hasta que recuperes la conexión.");
            return false;
        }
    });

    // Validación simple para correos
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}