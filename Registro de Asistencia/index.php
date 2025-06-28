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
    <script>
        window.usuarioLogeado = true;
    </script>

    <style>
        div.mensaje{
            background-color: #ffffff;
            max-width: 600px;
            margin: 10px auto;
            margin-top: 0;
            padding: 10px 30px;
            border-radius: 10px;
        }
        div.mensaje p, span {
            text-align: start;
            font-size: 1.1rem;
        }

    </style>

</head>

<body>
    <!-- Menú hamburguesa -->
    <nav>
        <div id="menu-btn">&#9776;</div>
        <ul id="menu-desplegable">
            <li><a href="index.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" fill-opacity="0" d="M6 8l6 -5l6 5v12h-2v-7l-1 -1h-6l-1 1v7h-2v-12Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.55s" dur="0.075s" values="0;1"/></path><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M5 21h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.1s" values="16;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M5 21v-13M19 21v-13"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.1s" values="14;0"/></path><path stroke-dasharray="24" stroke-dashoffset="24" d="M9 21v-8h6v8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="24;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M2 10l10 -8l10 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.3s" values="28;0"/></path></g></svg>    
            Inicio</a></li>
            <li><a href="Vista/editar_materias.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.1s" values="20;0"/></path><path fill="#000" fill-opacity="0" stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="fill-opacity" begin="0.55s" dur="0.075s" values="0;0.15"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.1s" values="8;0"/></path></g></svg>    
            Editar</a></li>
            <li><a href="Vista/asistencias.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="10" stroke-dashoffset="10" d="M3 5l2 2l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.1s" values="10;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M3 12l2 2l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.1s" values="10;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M3 19l2 2l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.1s" values="10;0"/></path><g fill="#000" fill-opacity="0" stroke-dasharray="24" stroke-dashoffset="24" stroke-width="1"><path d="M11.5 5c0 -0.83 0.67 -1.5 1.5 -1.5h6c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-6c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.65s" dur="0.075s" values="0;0.15"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.1s" values="24;0"/></path><path d="M11.5 12c0 -0.83 0.67 -1.5 1.5 -1.5h6c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-6c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.85s" dur="0.075s" values="0;0.15"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.1s" values="24;0"/></path><path d="M11.5 19c0 -0.83 0.67 -1.5 1.5 -1.5h6c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-6c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"><animate fill="freeze" attributeName="fill-opacity" begin="1.05s" dur="0.075s" values="0;0.15"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.1s" values="24;0"/></path></g></g></svg>    
            Asistencias</a></li>
            <li><a href="Vista/resumen.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#000" fill-opacity="0" stroke-dasharray="64" stroke-dashoffset="64" d="M22 3v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.95s" dur="0.075s" values="0;0.15"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="64;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M10 6h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.1s" values="10;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M10 10h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.45s" dur="0.1s" values="10;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M10 14h5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.55s" dur="0.1s" values="6;0"/></path><path stroke-dasharray="36" stroke-dashoffset="36" d="M2 6v15c0 0.55 0.45 1 1 1h15"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.25s" values="36;0"/></path></g></svg>    
            Resumen</a></li>
            <li><a href="Vista/Login.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-dasharray="28" stroke-dashoffset="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="28;0"/></path><path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="28;0"/></path></g></svg>   
            Mi cuenta</a></li>
        </ul>
    </nav>

    <!-- Página: index.html -->
    <main>
        <div class="mensaje">
            <h1>Registro de asistencia</h1>
            <div>
                <p>¿Ya asistió a la clase <span id="nombre-materia">______</span>?</p>
            </div>
        </div>
        <form id="form-asistencia">
            <label class="asistencia"><input type="radio" name="asistio" value="si" required> Sí</label>
            <label class="asistencia"><input type="radio" name="asistio" value="no" required> No</label><br>
            <button type="submit" class="boton-confirmar" style="font-weight: 700; font-size: 1.5rem;">Confirmar</button>
        </form>
    </main>

    <script type="module" src="assets/JS/main.js?v=<?= time() ?>&r=<?= rand() ?>&bust=1"></script>
</body>

</html>