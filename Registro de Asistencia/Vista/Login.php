<?php
require_once __DIR__ . '/../Controlador/AuthController.php';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
    <title>Inicio de Sesión</title>
</head>

<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>

    <?php if (isset($_SESSION['usuario'])): ?>
        <div class="login-container login-usuario">
            <h2>Información del Usuario</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" style="display: flex; margin: 10px auto;"><g fill="none"><path fill="url(#fluentColorPersonAvailable240)" d="M15.755 14a2.25 2.25 0 0 1 2.248 2.249v.918a2.75 2.75 0 0 1-.512 1.6C15.945 20.928 13.42 22 10 22c-3.422 0-5.945-1.072-7.487-3.236a2.75 2.75 0 0 1-.51-1.596v-.92a2.25 2.25 0 0 1 2.249-2.25z"/><path fill="url(#fluentColorPersonAvailable241)" d="M15.755 14a2.25 2.25 0 0 1 2.248 2.249v.918a2.75 2.75 0 0 1-.512 1.6C15.945 20.928 13.42 22 10 22c-3.422 0-5.945-1.072-7.487-3.236a2.75 2.75 0 0 1-.51-1.596v-.92a2.25 2.25 0 0 1 2.249-2.25z"/><path fill="url(#fluentColorPersonAvailable245)" fill-opacity="0.5" d="M15.755 14a2.25 2.25 0 0 1 2.248 2.249v.918a2.75 2.75 0 0 1-.512 1.6C15.945 20.928 13.42 22 10 22c-3.422 0-5.945-1.072-7.487-3.236a2.75 2.75 0 0 1-.51-1.596v-.92a2.25 2.25 0 0 1 2.249-2.25z"/><path fill="url(#fluentColorPersonAvailable242)" d="M10 2.005a5 5 0 1 1 0 10a5 5 0 0 1 0-10"/><path fill="url(#fluentColorPersonAvailable243)" d="M17.5 12a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11"/><path fill="url(#fluentColorPersonAvailable244)" fill-rule="evenodd" d="M20.854 15.146a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708l1.646 1.647l3.646-3.647a.5.5 0 0 1 .708 0" clip-rule="evenodd"/><defs><linearGradient id="fluentColorPersonAvailable240" x1="5.809" x2="8.394" y1="15.063" y2="23.319" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#9c6cfe"/><stop offset="1" stop-color="#7a41dc"/></linearGradient><linearGradient id="fluentColorPersonAvailable241" x1="10.004" x2="13.624" y1="13.047" y2="26.573" gradientUnits="userSpaceOnUse"><stop stop-color="#885edb" stop-opacity="0"/><stop offset="1" stop-color="#e362f8"/></linearGradient><linearGradient id="fluentColorPersonAvailable242" x1="7.378" x2="12.474" y1="3.334" y2="11.472" gradientUnits="userSpaceOnUse"><stop offset=".125" stop-color="#9c6cfe"/><stop offset="1" stop-color="#7a41dc"/></linearGradient><linearGradient id="fluentColorPersonAvailable243" x1="12.393" x2="19.984" y1="14.063" y2="21.95" gradientUnits="userSpaceOnUse"><stop stop-color="#52d17c"/><stop offset="1" stop-color="#22918b"/></linearGradient><linearGradient id="fluentColorPersonAvailable244" x1="15.313" x2="16.45" y1="15.51" y2="21.13" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#e3ffd9"/></linearGradient><radialGradient id="fluentColorPersonAvailable245" cx="0" cy="0" r="1" gradientTransform="matrix(0 8.5 -8.49852 0 17.5 18.5)" gradientUnits="userSpaceOnUse"><stop offset=".493" stop-color="#30116e"/><stop offset=".912" stop-color="#30116e" stop-opacity="0"/></radialGradient></defs></g></svg>
            <div class="info-usuario">
                <p><strong>Nombre:</strong> <?= htmlspecialchars($_SESSION['usuario']['nombre']) ?></p>
                <p><strong>Correo:</strong> <?= htmlspecialchars($_SESSION['usuario']['correo']) ?></p>
                <p><strong>Fecha de Nacimiento:</strong> <?= htmlspecialchars($_SESSION['usuario']['fecha_nacimiento']) ?></p>
            </div>
            <form method="post">
                <button name="logout" class="cancelar-edicion" id="cerrar-sesion-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke-dasharray="36" stroke-dashoffset="36" d="M12 4h-7c-0.55 0 -1 0.45 -1 1v14c0 0.55 0.45 1 1 1h7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.375s" values="36;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M9 12h11.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.45s" dur="0.15s" values="14;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M20.5 12l-3.5 -3.5M20.5 12l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.15s" values="6;0"/></path></g></svg>
                Cerrar Sesión</button>
            </form>
        </div>
    <?php else: ?>
        <div class="login-container">
            <h1 style="margin: 20px;">Iniciar Sesión</h1>
            <form method="post" id="login-form">
                <label for="username" style="font-weight: bold;">Correo</label>
                <input type="text" id="username" name="username" placeholder="correo@gmail.com" required>

                <label for="password" style="font-weight: bold;">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="********" required>
                <div style="display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
                    <button type="submit" name="login" class="iniciar-sesion">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke-dasharray="48" stroke-dashoffset="48" d="M8 5v-1c0 -0.55 0.45 -1 1 -1h9c0.55 0 1 0.45 1 1v16c0 0.55 -0.45 1 -1 1h-9c-0.55 0 -1 -0.45 -1 -1v-1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.45s" values="48;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M4 12h11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.525s" dur="0.15s" values="12;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M15 12l-3.5 -3.5M15 12l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.675s" dur="0.15s" values="6;0"/></path></g></svg>    
                    Iniciar sesión</button>
                    <button type="button" class="crear-sesion" name="crear" onclick="window.location.href='Crear-Cuenta.php'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.15s" values="20;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M9 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.15s" dur="0.15s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M15 6h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.375s" dur="0.15s" values="8;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M18 3v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.525s" dur="0.15s" values="8;0"/></path></g></svg>    
                    Crear Cuenta</button>
                </div>
                    
                <div style="display: flex; justify-content: center; margin: 20px;">
                    <span> <a href="Cambiar.php" style="color: rgb(37 99 235); text-decoration: none;">Cambiar contraseña</a></span>
                </div>
            </form>
            <?php if (!empty($mensaje)): ?>
                <div class="<?= htmlspecialchars($css_class) ?>">
                    <?= htmlspecialchars($mensaje) ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>


    <script type="module" src="../assets/JS/main.js"></script>
</body>

</html>