export function initLogin() {
    const container = document.querySelector("main");
    const templateLogin = document.getElementById("login-template");
    const templateInfo = document.getElementById("Información");

    // Verificar si ya hay un usuario en sesión
    const usuarioEnSesion = JSON.parse(localStorage.getItem("usuarioEnSesion"));

    if (usuarioEnSesion) {
        // Si hay un usuario en sesión, mostrar el template de Información
        const clone = templateInfo.content.cloneNode(true);
        container.innerHTML = "";
        container.appendChild(clone);

        // Mostrar información del usuario
        const infoContainer = container.querySelector(".info-usuario");
        if (infoContainer) {
            infoContainer.innerHTML = `
                <p><strong>Nombre:</strong> ${usuarioEnSesion.nombre}</p>
                <p><strong>Correo:</strong> ${usuarioEnSesion.correo}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${usuarioEnSesion.fechaNacimiento}</p>
            `;
        }

        // Botón de cerrar sesión
        const cerrarSesionBtn = container.querySelector("#cerrar-sesion-btn");
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener("click", () => {
                localStorage.removeItem("usuarioEnSesion");
                alert("Has cerrado sesión.");
                window.location.reload(); // Recargar la página para volver al login
            });
        }
    } else {
        // Si no hay usuario en sesión, mostrar el template de login
        const clone = templateLogin.content.cloneNode(true);
        container.innerHTML = "";
        container.appendChild(clone);

        const form = document.getElementById("login-form");

        // Inicializamos datos de usuarios registrados
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Excepciones personalizadas
        class UsuarioNoExistente extends Error {
            constructor(message) {
                super(message);
                this.name = "UsuarioNoExistente";
                this.cssClass = "error-usuario";
            }
        }
        class ContraseñaIncorrecta extends Error {
            constructor(message) {
                super(message);
                this.name = "ContraseñaIncorrecta";
                this.cssClass = "error-contraseña";
            }
        }
        class CuentaBloqueada extends Error {
            constructor(minutosRestantes) {
                super(`La cuenta está bloqueada. Intenta nuevamente en ${minutosRestantes} minutos.`);
                this.name = "CuentaBloqueada";
                this.cssClass = "error-bloqueada";
                this.minutosRestantes = minutosRestantes;
            }
        }

        // Manejo de intentos fallidos
        const intentosFallidos = JSON.parse(localStorage.getItem("intentosFallidos")) || {};

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const correo = form.username.value.trim();
            const password = form.password.value.trim();

            try {
                // Validar si el usuario existe
                const usuario = usuarios.find(u => u.correo === correo); // Buscamos por correo
                if (!usuario) {
                    throw new UsuarioNoExistente("El usuario no existe.");
                }

                // Verificar si la cuenta está bloqueada y si han pasado 10 minutos
                const bloqueo = intentosFallidos[correo];
                if (bloqueo && bloqueo.contador >= 3) {
                    const ahora = new Date().getTime();
                    const tiempoBloqueo = bloqueo.tiempo;
                    const diferenciaMinutos = (ahora - tiempoBloqueo) / (1000 * 60);

                    if (diferenciaMinutos < 10) {
                        throw new CuentaBloqueada(Math.ceil(10 - diferenciaMinutos));
                    } else {
                        // Desbloquear cuenta automáticamente después de 10 minutos
                        delete intentosFallidos[correo];
                        localStorage.setItem("intentosFallidos", JSON.stringify(intentosFallidos));
                    }
                }

                // Validar contraseña
                if (usuario.contraseña !== password) { // Validamos con "contraseña"
                    // Incrementar intentos fallidos
                    const ahora = new Date().getTime();
                    if (!intentosFallidos[correo]) {
                        intentosFallidos[correo] = { contador: 0, tiempo: ahora };
                    }
                    intentosFallidos[correo].contador++;
                    intentosFallidos[correo].tiempo = ahora;
                    localStorage.setItem("intentosFallidos", JSON.stringify(intentosFallidos));

                    throw new ContraseñaIncorrecta("Contraseña incorrecta.");
                }

                // Éxito: Guardar usuario en sesión y redirigir
                localStorage.setItem("usuarioEnSesion", JSON.stringify(usuario));
                alert("Inicio de sesión exitoso. Bienvenido, " + usuario.nombre + "!");
                window.location.reload();
            } catch (error) {
                if (error instanceof UsuarioNoExistente ||
                    error instanceof ContraseñaIncorrecta ||
                    error instanceof CuentaBloqueada) {
                        mostrarErrorEnUI(error, form);
                } else {
                    console.error("Error inesperado:", error);
                }
            }
        });
    }
}

function mostrarErrorEnUI(error, form) {
    let errorDiv = document.getElementById("mensaje-error-login");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "mensaje-error-login";
        form.parentNode.insertBefore(errorDiv, form);
    }
    errorDiv.className = error.cssClass;
    errorDiv.textContent = error.message;
    errorDiv.style.display = "block";
    setTimeout(() => errorDiv.style.display = "none", 4000);
}