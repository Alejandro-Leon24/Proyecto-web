<?php
require_once __DIR__ . '/../Config/database.php';

/**
 * Clase que gestiona las operaciones relacionadas con los usuarios en la base de datos.
 *
 * Esta clase proporciona métodos estáticos para crear, buscar, actualizar y gestionar la información de los usuarios,
 * incluyendo el registro de intentos fallidos de inicio de sesión y el cambio de contraseñas.
 */

class Usuario
{
    /**
     * Crea un nuevo usuario en la base de datos.
     * @param string $nombre Nombre del usuario.
     * @param string $correo Correo electrónico del usuario.
     * @param string $contraseña Contraseña del usuario (se almacenará hasheada).
     * @param string $fechaNacimiento Fecha de nacimiento del usuario.
     *
     * @return bool Retorna true si la creación del usuario fue exitosa, false en caso contrario.
     */

    public static function crear($nombre, $correo, $contraseña, $fechaNacimiento)
    {
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

    /**
     * Busca un usuario en la base de datos por su correo electrónico.
     * @param string $correo Correo electrónico del usuario a buscar.
     * @return Retorna un array asociativo con la información del usuario si se encuentra, o false si no se encuentra.
     */

    public static function buscarPorCorreo($correo)
    {
        global $Conexion;
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $Conexion->prepare($sql);
        $stmt->execute([$correo]);
        return $stmt->fetch();
    }

    /**
     * Registra un intento fallido de inicio de sesión para un usuario.
     *
     * @param int $usuarioId ID del usuario.
     * @param int $intentos Número de intentos fallidos.
     * @param string|null $bloqueadoHasta Fecha y hora hasta la cual el usuario estará bloqueado.
     */

    public static function registrarIntentoFallido($usuarioId, $intentos, $bloqueadoHasta = null)
    {
        global $Conexion;
        $sql = "UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?";
        $Conexion->prepare($sql)->execute([$intentos, $bloqueadoHasta, $usuarioId]);
    }

    /**
     * Resetea el número de intentos fallidos de inicio de sesión para un usuario.
     *
     * @param int $usuarioId ID del usuario.
     */

    public static function resetearIntentos($usuarioId)
    {
        global $Conexion;
        $sql = "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?";
        $Conexion->prepare($sql)->execute([$usuarioId]);
    }

    /**
     * Busca un usuario en la base de datos por su correo electrónico y fecha de nacimiento.
     *
     * @param string $correo Correo electrónico del usuario a buscar.
     * @param string $fechaNacimiento Fecha de nacimiento del usuario.
     *
     * @return mixed Retorna un array asociativo con la información del usuario si se encuentra, o false si no se encuentra.
     */

    public static function buscarUsuario($correo, $fechaNacimiento)
    {
        global $Conexion;
        $sql = "SELECT * FROM usuarios WHERE correo = ? AND fecha_nacimiento = ?";
        $stmt = $Conexion->prepare($sql);
        $stmt->execute([$correo, $fechaNacimiento]);
        return $stmt->fetch();
    }

    /**
     * Cambia la contraseña de un usuario.
     *
     * @param string $correo Correo electrónico del usuario al que se le cambiará la contraseña.
     * @param string $nuevaContraseña Nueva contraseña del usuario (se almacenará hasheada).
     *
     * @return bool Retorna true si el cambio de contraseña fue exitoso, false en caso contrario.
     */

    public static function cambiarContraseña($correo, $nuevaContraseña)
    {
        global $Conexion;
        $sql = "UPDATE usuarios SET contrasena = ? WHERE correo = ?";
        $stmt = $Conexion->prepare($sql);
        return $stmt->execute([password_hash($nuevaContraseña, PASSWORD_DEFAULT), $correo]);
    }
}
