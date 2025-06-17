<?php
require_once __DIR__ . '/../Modelo/Usuario.php';

$mensaje = "";

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
?>