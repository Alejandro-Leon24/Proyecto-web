<?php
require_once __DIR__ . '/../Modelo/Resumen.php';
session_start();

if (!isset($_SESSION['usuario']['id'])) {
    header('Location: Login.php');
    exit;
}
$usuario_id = $_SESSION['usuario']['id'];

$resumen = Resumen::obtenerResumen($usuario_id);
