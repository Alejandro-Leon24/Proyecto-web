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

    // Inputs de asistencia (íconos)
    const asistenciaForm = document.getElementById("form-asistencia");
    if (asistenciaForm) {
        const radios = asistenciaForm.querySelectorAll("input[type=radio]");
        radios.forEach(radio => {
            const label = radio.parentElement;
            label.style.fontSize = "2rem";
            label.style.display = "inline-block";
            label.style.margin = "10px";
            if (radio.value === "si") {
                label.innerHTML = `<input type="radio" name="asistio" value="si" required> 
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="#006529" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11l6 6l10 -10"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.28s" values="24;0"/></path></svg>
                Asistí`;
            } else if (radio.value === "no") {
                label.innerHTML = `<input type="radio" name="asistio" value="no" required> 
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="#dd1b1b" stroke-dasharray="12" stroke-dashoffset="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.21s" values="12;0"/></path></svg>
                No asistí`;
            }
        });
    }
});