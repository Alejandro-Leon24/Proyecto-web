<?php
require_once __DIR__ . '/../Controlador/CrearCuentaController.php';

?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
    <title>Crear Cuenta</title>
</head>

<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>
    <div class="login-container">
        <h2>Crear Cuenta</h2>
        <form method="post">
            <label for="nombre" style="font-weight: bold;">Nombre</label>
            <input type="text" id="nombre" name="nombre" placeholder="Nombre completo" required>

            <label for="correo" style="font-weight: bold;">Correo</label>
            <input type="email" id="correo" name="correo" placeholder="correo@gmail.com" required>

            <label for="contraseña" style="font-weight: bold;">Contraseña</label>
            <input type="password" id="contraseña" name="contraseña" placeholder="********" required minlength="6">

            <label for="fechaNacimiento" style="font-weight: bold;">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>

            <div>
                <button type="submit" name="crear" class="boton-confirmar">Crear Cuenta</button>
                <button type="button" onclick="window.location.href='Login.php'" class="cancelar-edicion">Cancelar</button>
            </div>
        </form>
        <?php if (!empty($mensaje)): ?>
            <div class="error-usuario"><?= htmlspecialchars($mensaje) ?></div>
        <?php endif; ?>
    </div>
    <script type="module" src="../assets/JS/main.js"></script>
</body>

</html>