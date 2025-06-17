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
    <meta name="viewport" content="width=720, user-scalable=no">
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
        <div class="barra-filtros">
            <label for="mes-select"><b>Mes:</b></label>
            <select id="combo-mes"></select>
        </div>
        <div class="barra-filtros">
            <label for="semana-select"><b>Semana:</b></label>
            <select id="combo-semana"></select>
        </div>
        <div class="barra-filtros">
            <button id="btn-buscar">Buscar</button>
        </div>

        <h1>Tabla de asistencias</h1>
        <table border="1">
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
    </template>

    <script type="module" src="../assets/JS/main.js"></script>
</body>

</html>