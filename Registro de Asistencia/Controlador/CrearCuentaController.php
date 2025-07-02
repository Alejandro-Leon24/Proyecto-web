<?php
require_once __DIR__ . '/../Modelo/Usuario.php';

$mensaje = "";
$mensaje2 = "";

/**
 * Controlador para la creación de cuentas de usuario, recuperación de contraseña y cambio de contraseña.
 *
 * Este controlador maneja las solicitudes POST para crear una nueva cuenta,
 * recuperar la contraseña olvidada y cambiar la contraseña existente.
 * Realiza validaciones de los datos ingresados por el usuario y utiliza la clase Usuario
 * para interactuar con la base de datos.
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['crear'])) {
    $nombre = trim($_POST['nombre'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $contraseña = $_POST['contraseña'] ?? '';
    $fechaNacimiento = $_POST['fechaNacimiento'] ?? '';

    // Validaciones básicas
    if (!$nombre || !$correo || !$contraseña || !$fechaNacimiento) {
        $mensaje = "Todos los campos son obligatorios.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mensaje = "El correo no es válido.";
    } elseif (strlen($contraseña) < 6) {
        $mensaje = "La contraseña debe tener al menos 6 caracteres.";
    } elseif (Usuario::buscarPorCorreo($correo)) {
        $mensaje = "El correo ya está registrado.";
    } else {
        $resultado = Usuario::crear($nombre, $correo, $contraseña, $fechaNacimiento);
        if ($resultado) {
            header("Location: Login.php?registro=ok");
            exit;
        } else {
            $mensaje = "Error al crear la cuenta. Intenta nuevamente.";
        }
    }
}

if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['recuperar'])){
    $correo = trim($_POST['email'] ?? '');
    $fechaNacimiento = $_POST['fechaNacimiento'] ?? '';

    if (!$correo || !$fechaNacimiento) {
        $mensaje = "El correo y la fecha de nacimiento son obligatorios.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mensaje = "El correo no es válido.";
    } else {
        $usuario = Usuario::buscarUsuario($correo, $fechaNacimiento);
        if ($usuario) {
            $mensaje = "Usuario encontrado. Puedes proceder a cambiar tu contraseña.";
        } else {
            $mensaje = "No se encontró un usuario con ese correo y fecha de nacimiento.";
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cambiar'])) {
    $correo = trim($_POST['email_recuperado'] ?? '');
    $nuevaContraseña = $_POST['nuevaContraseña'] ?? '';

    if (!$correo || !$nuevaContraseña) {
        $mensaje2 = "El correo y la nueva contraseña son obligatorios.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mensaje2 = "El correo no es válido.";
    } elseif (strlen($nuevaContraseña) < 6) {
        $mensaje2 = "La nueva contraseña debe tener al menos 6 caracteres.";
    } else {
        $resultado = Usuario::cambiarContraseña($correo, $nuevaContraseña);
        if ($resultado) {
            $mensaje2 = "Contraseña cambiada exitosamente.";
        } else {
            $mensaje2 = "Error al cambiar la contraseña. Intenta nuevamente.";
        }
    }
}
?>