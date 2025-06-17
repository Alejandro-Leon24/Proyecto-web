<?php
$host = 'localhost';
$port = '3306';
$db  = 'asistencia_db';
$user = 'root';


try {
    $Conexion = new PDO("mysql:host=$host;port=$port;dbname=$db",$user);
    $Conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $Conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit;
}
