<?php
require_once __DIR__ . '/../Modelo/Usuario.php';
require_once __DIR__ . '/../Modelo/Excepciones.php';

session_start();

$mensaje = "";
$css_class = "";


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $correo = $_POST['username'] ?? '';
    $contrasena = $_POST['password'] ?? '';

    try {
        $usuario = Usuario::buscarPorCorreo($correo);

        if (!$usuario) {
            throw new UsuarioNoExistenteException("El usuario no existe.");
        }
        if ($usuario['bloqueado_hasta'] && strtotime($usuario['bloqueado_hasta']) > time()) {
            $minutosRestantes = ceil((strtotime($usuario['bloqueado_hasta']) - time()) / 60);
            throw new CuentaBloqueadaException($minutosRestantes);
        }
        if (!password_verify($contrasena, $usuario['contrasena'])) {
            $intentos = $usuario['intentos_fallidos'] + 1;
            if ($intentos >= 3) {
                $bloqueado_hasta = date('Y-m-d H:i:s', time() + 10 * 60); // 10 minutos
                Usuario::registrarIntentoFallido($usuario['id'], $intentos, $bloqueado_hasta);
                throw new CuentaBloqueadaException(10);
            } else {
                Usuario::registrarIntentoFallido($usuario['id'], $intentos, null);
                throw new ContraseñaIncorrectaException("Contraseña incorrecta. Intento $intentos de 3.");
            }
        }

        // Login exitoso, resetear intentos y guardar usuario en sesión
        Usuario::resetearIntentos($usuario['id']);
        $_SESSION['usuario'] = [
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'correo' => $usuario['correo'],
            'fecha_nacimiento' => $usuario['fecha_nacimiento']
        ];
        header('Location: Login.php');
        exit;

    } catch (UsuarioNoExistenteException $e) {
        $mensaje = $e->getMessage();
        $css_class = "error-usuario";
    } catch (CuentaBloqueadaException $e) {
        $mensaje = $e->getMessage();
        $css_class = "error-bloqueada";
    } catch (ContraseñaIncorrectaException $e) {
        $mensaje = $e->getMessage();
        $css_class = "error-contraseña";
    } catch (Exception $e) {
        $mensaje = "Error inesperado: " . $e->getMessage();
        $css_class = "error-usuario";
    }
}

// Manejo de logout
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    session_destroy();
    header("Location: Login.php");
    exit;
}
?>