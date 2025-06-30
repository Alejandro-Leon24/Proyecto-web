import { initMaterias } from './materias.js';
import { initRegistroAsistencia, initTablaAsistencias} from './asistencias.js';
import { mostrarMensajePersonalizado } from './utilidades.js';
import { initLogin } from './login.js';
import { initCrearCuenta } from "./crearCuenta.js";

/**
 * Verifica si existe la variable de sesión de usuario (PHP -> JS)
 * Esto depende de que el backend imprima una variable JS si está logueado.
 * Si no existe, muestra advertencia y redirige a Login.php.
 */
function verificarSesionObligatoria(paginaActual) {
    // El backend debe imprimir esta variable JS si la sesión está activa
    // Ejemplo: <script>window.usuarioLogeado = true;</script>
    if (typeof window.usuarioLogeado === "undefined" || !window.usuarioLogeado) {
        // Exceptuamos páginas de login y crear cuenta
        if (!["Login.php", "Crear-Cuenta.php", "Cambiar.php"].includes(paginaActual)) {
            mostrarMensajePersonalizado("Debes iniciar sesión antes de realizar cualquier acción.");
            setTimeout(() => {
                if(["index.php"].includes(paginaActual)){
                    window.location.href = "../Vista/Login.php";
                }else{
                    window.location.href = "Login.php";
                }
            }, 1500);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    let page = path.split("/").pop();
    if (!page || page === "") page = "index.php";


    // --- NUEVO: Inyectar template para asistencias.php antes de inicializar JS ---
    const container = document.querySelector("main");
    if (page === "asistencias.php") {
        const tpl = document.getElementById("tabla-asistencias");
        if (tpl && container) {
            // Limpia y coloca el template
            const clone = tpl.content.cloneNode(true);
            container.innerHTML = "";
            container.appendChild(clone);
        }
    }

    // ---- INICIALIZADORES DE MÓDULO DE PÁGINA ----
    // Solo pedir sesión si no es login ni crear cuenta
    verificarSesionObligatoria(page);

    if (page === "editar_materias.php") {
        initMaterias();
    } else if (page === "index.php") {
        initRegistroAsistencia();
    } else if (page === "asistencias.php") {
        initTablaAsistencias();
    } else if (page === "Login.php") {
        initLogin();
    } else if (page === "Crear-Cuenta.php") {
        initCrearCuenta();
    }

    // Menú desplegable (funciona en cualquier página)
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu-desplegable");
    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.style.display = menu.style.display === "flex" ? "none" : "flex";
        });
        // Cerrar menú si se hace click fuera
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && e.target !== menuBtn) {
                menu.style.display = "none";
            }
        });
    }
});