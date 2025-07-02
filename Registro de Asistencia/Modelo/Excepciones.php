<?php
/**
 * Define las excepciones personalizadas para el sistema de registro de asistencia.
 *
 * Este archivo contiene las definiciones de las clases de excepción personalizadas
 * utilizadas en el sistema de registro de asistencia. Estas excepciones se utilizan
 * para manejar errores específicos relacionados con la autenticación de usuarios,
 * como usuarios no existentes, contraseñas incorrectas y cuentas bloqueadas.
 */

/**
 * @class UsuarioNoExistenteException
 * Excepción lanzada cuando un usuario no existe en el sistema.
 *
 * Esta excepción se utiliza para indicar que el nombre de usuario proporcionado
 * no se encuentra en la base de datos de usuarios.
 */

/**
 * @class ContraseñaIncorrectaException
 * Excepción lanzada cuando la contraseña proporcionada es incorrecta.
 *
 * Esta excepción se utiliza para indicar que la contraseña ingresada por el
 * usuario no coincide con la contraseña almacenada para ese usuario.
 */

/**
 * @class CuentaBloqueadaException
 * Excepción lanzada cuando una cuenta de usuario está bloqueada debido a intentos fallidos de inicio de sesión.
 *
 * Esta excepción se utiliza para indicar que la cuenta del usuario ha sido bloqueada
 * temporalmente debido a múltiples intentos fallidos de inicio de sesión. Incluye
 * información sobre el tiempo restante hasta que la cuenta se desbloquee.
 */
class UsuarioNoExistenteException extends Exception {}
class ContraseñaIncorrectaException extends Exception {}
class CuentaBloqueadaException extends Exception {
    public $minutosRestantes;
    public function __construct($minutosRestantes) {
        parent::__construct("La cuenta está bloqueada. Intenta nuevamente en $minutosRestantes minutos.");
        $this->minutosRestantes = $minutosRestantes;
    }
}
?>