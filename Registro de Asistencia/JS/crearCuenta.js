export function initCrearCuenta() {
    const container = document.querySelector("main");
    const template = document.getElementById("crear-cuenta-template");
    const clone = template.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);

    const form = document.getElementById("crear-cuenta-form");

    // Validación y almacenamiento de usuarios
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombre = form.nombre.value.trim();
        const correo = form.correo.value.trim();
        const contraseña = form.contraseña.value.trim();
        const fechaNacimiento = form.fechaNacimiento.value;

        try {
            // Validaciones
            if (!nombre || !correo || !contraseña || !fechaNacimiento) {
                throw new Error("Todos los campos son obligatorios.");
            }

            if (!validateEmail(correo)) {
                throw new Error("El correo ingresado no es válido.");
            }

            if (contraseña.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres.");
            }

            // Obtener usuarios registrados
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            // Verificar si el correo ya está registrado
            if (usuarios.some(user => user.correo === correo)) {
                throw new Error("El correo ya está registrado.");
            }

            // Generar un ID único para el usuario
            const nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

            // Crear el nuevo usuario
            const nuevoUsuario = {
                id: nuevoId,
                nombre,
                correo,
                contraseña,
                fechaNacimiento
            };

            // Guardar el nuevo usuario
            usuarios.push(nuevoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cuenta creada exitosamente. ¡Ahora puedes iniciar sesión!");
            window.location.href = "Login.html";
        } catch (error) {
            alert(error.message);
        }
    });

    // Función para cancelar
    const cancelarBtn = document.getElementById("cancelar-btn");
    cancelarBtn.addEventListener("click", () => {
        window.location.href = "Login.html";
    });

    // Validación simple para correos
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}