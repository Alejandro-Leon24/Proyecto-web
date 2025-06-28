<?php
session_start();
if (!isset($_SESSION['usuario']['id'])) {
    header('Location: Login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Registro de Asistencia</title>
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
    <script>window.usuarioLogeado = true;</script>
</head>

<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>

    <!-- El main se llena por JS -->
    <main></main>

    <!-- Plantilla para tabla de asistencias con filtro (mejor opción para integración con tu JS) -->
    <template id="tabla-asistencias">
        <h1>Tabla de asistencias</h1>
        <div class="barra-filtros">
            <label for="mes-select"><b>Mes:</b></label>
            <select id="combo-mes"></select>
        </div>
        <div class="barra-filtros">
            <label for="semana-select"><b>Semana:</b></label>
            <select id="combo-semana"></select>
        </div>
        <div class="barra-filtros">
            <button id="btn-buscar" class="boton-confirmar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path fill="#fff" fill-opacity="0.15" d="M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z"/><path d="M10.5 13.5l-7.5 7.5"/></g></svg>    
            Buscar</button>
        </div>
        <div style="overflow-y: auto; max-width: 660px; margin: 0 auto;">
        <table style="margin-top: 20px;">
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                </tr>
            </thead>
            <tbody>
                <!-- Filas dinámicas -->
            </tbody>
        </table>
        </div>
        
    </template>

    <script type="module" src="../assets/JS/main.js"></script>
</body>

</html>