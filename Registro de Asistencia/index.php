<?php
session_start();
if (!isset($_SESSION['usuario']['id'])) {
    header('Location: Vista/Login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="assets/CSS/estilos.css">
    <title>Registro de Asistencia</title>
    <link rel="manifest" href="manifest.json">
    <link rel="icon" href="IMG/icono.png">
    <script>window.usuarioLogeado = true;</script>

</head>

<body>
    <!-- Menú hamburguesa -->
    <nav>
        <div id="menu-btn">&#9776;</div>
        <ul id="menu-desplegable">
            <li><a href="index.php">Inicio</a></li>
            <li><a href="Vista/editar_materias.php">Editar</a></li>
            <li><a href="Vista/asistencias.php">Asistencias</a></li>
            <li><a href="Vista/resumen.php">Resumen</a></li>
            <li><a href="Vista/Login.php">Mi cuenta</a></li>
        </ul>
    </nav>

    <!-- Página: index.html -->
    <main>
        <h1>Registro de asistencia</h1>
        <p>¿Ya asistió a la clase <span id="nombre-materia">______</span>?</p>
        <form id="form-asistencia">
            <label><input type="radio" name="asistio" value="si" required> Sí</label><br>
            <label><input type="radio" name="asistio" value="no" required> No</label><br><br>
            <button type="submit" class="boton-confirmar">Confirmar</button>
        </form>
    </main>

    <script type="module" src="assets/JS/main.js?v=<?= time() ?>&r=<?= rand() ?>&bust=1"></script>
</body>

</html>