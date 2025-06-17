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
            <img src="../assets/IMG/user.png" alt="Usuario">
            <div class="info-usuario">
                <p><strong>Nombre:</strong> <?= htmlspecialchars($_SESSION['usuario']['nombre']) ?></p>
                <p><strong>Correo:</strong> <?= htmlspecialchars($_SESSION['usuario']['correo']) ?></p>
                <p><strong>Fecha de Nacimiento:</strong> <?= htmlspecialchars($_SESSION['usuario']['fecha_nacimiento']) ?></p>
            </div>
            <form method="post">
                <button name="logout" class="cancelar-edicion" id="cerrar-sesion-btn">Cerrar Sesión</button>
            </form>
        </div>
    <?php else: ?>
        <div class="login-container">
            <h2>Iniciar Sesión</h2>
            <form method="post" id="login-form">
                <label for="username">Correo</label>
                <input type="text" id="username" name="username" required>

                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
                <div>
                    <button type="submit" name="login" class="boton-confirmar">Iniciar sesión</button>
                    <button type="button" class="boton-confirmar" name="crear" onclick="window.location.href='Crear-Cuenta.php'">Crear Cuenta</button>
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