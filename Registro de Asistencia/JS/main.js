import { initMaterias } from './materias.js';
import { initRegistroAsistencia, initTablaAsistencias } from './asistencias.js';
import { initResumen } from './resumen.js';
import { mostrarMensajePersonalizado } from './utilidades.js';
import { initLogin } from './login.js';
import { initCrearCuenta } from "./crearCuenta.js";

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    let page = path.split("/").pop();
    if (!page || page === "") page = "index.html";

    // Cargar template según página
    const templates = {
        "editar_materias.html": "editar-materias",
        "asistencias.html": "tabla-asistencias",
        "resumen.html": "resumen-asistencia",
        "Login.html": "login-template",
        "Crear-Cuenta.html": "crear-cuenta-template"
    };

    const container = document.querySelector("main");
    if (templates[page]) {
        const tpl = document.getElementById(templates[page]);
        if (tpl && container) {
            const clone = tpl.content.cloneNode(true);
            container.innerHTML = "";
            container.appendChild(clone);
        }
    }

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.error("Error al registrar el SW", err));
    }

    // ---- INICIALIZADORES DE MÓDULO DE PÁGINA ----
    if (page === "editar_materias.html") {
        initMaterias();
    } else if (page === "index.html") {
        initRegistroAsistencia();
    } else if (page === "asistencias.html") {
        initTablaAsistencias();
    } else if (page === "resumen.html") {
        initResumen();
    }else if (page === "Login.html") { // Inicializar Login
        initLogin();
    }else if (page === "Crear-Cuenta.html") { // Inicializar Crear Cuenta
        initCrearCuenta();
    }

    // Menú desplegable
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu-desplegable");
    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });
    }

    // Inputs de asistencia (íconos)
    const asistenciaForm = document.getElementById("form-asistencia");
    if (asistenciaForm) {
        const radios = asistenciaForm.querySelectorAll("input[type=radio]");
        radios.forEach(radio => {
            const label = radio.parentElement;
            label.style.fontSize = "1.5rem";
            label.style.display = "inline-block";
            label.style.margin = "10px";
            if (radio.value === "si") {
                label.innerHTML = `<input type="radio" name="asistio" value="si" required> ✔ Asistí`;
            } else if (radio.value === "no") {
                label.innerHTML = `<input type="radio" name="asistio" value="no" required> ✘ No asistí`;
            }
        });
    }

    // Aviso si no hay materias
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    if (materias.length === 0 && page !== "editar_materias.html") {
        mostrarMensajePersonalizado("Todavía no tienes materias registradas. Ve a 'Editar' para agregarlas.");
    }

});