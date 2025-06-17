<?php
require_once __DIR__ . '/../Config/database.php';

class Usuario {
    public static function crear($nombre, $correo, $contraseña, $fechaNacimiento) {
        global $Conexion;
        $sql = "INSERT INTO usuarios (nombre, correo, contrasena, fecha_nacimiento) VALUES (?, ?, ?, ?)";
        $stmt = $Conexion->prepare($sql);
        return $stmt->execute([
            $nombre,
            $correo,
            password_hash($contraseña, PASSWORD_DEFAULT),
            $fechaNacimiento
        ]);
    }
    public static function buscarPorCorreo($correo) {
        global $Conexion;
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $Conexion->prepare($sql);
        $stmt->execute([$correo]);
        return $stmt->fetch();
    }
    public static function registrarIntentoFallido($usuarioId, $intentos, $bloqueadoHasta = null) {
        global $Conexion;
        $sql = "UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?";
        $Conexion->prepare($sql)->execute([$intentos, $bloqueadoHasta, $usuarioId]);
    }

    public static function resetearIntentos($usuarioId) {
        global $Conexion;
        $sql = "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?";
        $Conexion->prepare($sql)->execute([$usuarioId]);
    }
}
?>