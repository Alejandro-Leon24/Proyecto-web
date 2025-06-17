<?php
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