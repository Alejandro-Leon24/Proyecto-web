export function initLogin() {
const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            // Validación de conexión
            if (!navigator.onLine) {
                alert("No tienes conexión a internet. No puedes iniciar sesión hasta que recuperes la conexión.");
                event.preventDefault();
                return false;
            }

            // Validación de campos
            const correo = form.username.value.trim();
            const password = form.password.value.trim();

            if (!correo || !password) {
                alert("Todos los campos son obligatorios.");
                event.preventDefault();
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                alert("El correo ingresado no es válido.");
                event.preventDefault();
                return false;
            }
            if (password.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                event.preventDefault();
                return false;
            }
        });
    }

    // Alerta al cerrar sesión si no hay internet
    const cerrarSesionBtn = document.getElementById("cerrar-sesion-btn");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", function (event) {
            if (!navigator.onLine) {
                if (!confirm("Si cierras sesión, no podrás volver a iniciar sesión hasta que tengas internet. ¿Deseas continuar?")) {
                    event.preventDefault();
                    return false;
                }
            }
        });
    }
};