<?php
require_once __DIR__ . '/../Controlador/CrearCuentaController.php';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
    <title>Cambiar Contraseña</title>
</head>
<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>
    <h1>Cambiar Contraseña</h1>
    <div class="login-container">
        <form method="post">
        <label for="email" style="font-weight: bold;">Correo Electrónico:</label>
        <input type="email" id="email" name="email" required>
        <label for="fechaNacimiento" style="font-weight: bold;">Fecha de Nacimiento:</label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>
        <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button type="submit" class="iniciar-sesion" name="recuperar">Buscar Usuario</button>
            <button type="button" class="cancelar-edicion" onclick="window.location.href='Login.php'">Cancelar</button>
        </div>
    </form>
    </div>
    <?php if (!empty($mensaje)): ?>
        <?php if($mensaje === "Usuario encontrado. Puedes proceder a cambiar tu contraseña."): ?>
            <div class="notificacion"><?= htmlspecialchars($mensaje) ?></div>
            <form method="post">
                <label for="nuevaContraseña">Nueva Contraseña:</label>
                <input type="password" id="nuevaContraseña" name="nuevaContraseña" required>
                <!-- Campo oculto para mantener el correo electrónico -->
                <input type="hidden" name="email_recuperado" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                <button type="submit" name="cambiar" class="boton-confirmar">Cambiar Contraseña</button>
            </form>
        <?php else: ?>
            <div class="error-usuario"><?= htmlspecialchars($mensaje) ?></div>
        <?php endif; ?>
    <?php endif; ?>
    <?php if(!empty($mensaje2)): ?>
        <?php if ($mensaje2 === "Contraseña cambiada exitosamente."): ?>
            <div class="notificacion"><?= htmlspecialchars($mensaje2) ?></div>
        <?php else: ?>
            <div class="error-usuario"><?= htmlspecialchars($mensaje2) ?></div>
        <?php endif; ?>
    <?php endif; ?>
    <script type="module" src="../assets/JS/main.js"></script>
</body>
</html>