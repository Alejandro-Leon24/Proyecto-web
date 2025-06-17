<?php
require_once __DIR__ . '/../Config/database.php';
require_once __DIR__ . '/../Modelo/Asistencia.php';
session_start();

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(["error" => "Debes iniciar sesión"]);
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['fecha_inicio'], $_GET['fecha_fin'])) {
    $fecha_inicio = $_GET['fecha_inicio'];
    $fecha_fin = $_GET['fecha_fin'];
    $asistencias = Asistencia::obtenerAsistenciasPorRango($usuario_id, $fecha_inicio, $fecha_fin);
    echo json_encode($asistencias);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $materia_id = intval($_POST['materia_id']);
    $asistio = $_POST['asistio'];
    $dia = $_POST['dia'];
    $hora_inicio = $_POST['hora_inicio'];
    $hora_fin = $_POST['hora_fin'];
    $fecha = date('Y-m-d'); // Solo la fecha

    // ¿Ya existe asistencia para esta materia, día y fecha?
    $ya = Asistencia::obtenerAsistenciaDelDia($usuario_id, $materia_id, $dia, $fecha);
    if ($ya) {
        echo json_encode([
            "error" => "Ya registraste asistencia para esta clase hoy."
        ]);
        exit;
    }
    // Registrar
    $ok = Asistencia::registrarAsistencia($usuario_id, $materia_id, $asistio, $dia, $hora_inicio, $hora_fin, date('Y-m-d H:i:s'));
    if ($ok) {
        echo json_encode([
            "ok" => "Asistencia registrada correctamente"
        ]);
    } else {
        echo json_encode([
            "error" => "Error al registrar asistencia"
        ]);
    }
    exit;
}

// Obtener materias y horarios de hoy para mostrar en el formulario (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $dia = isset($_GET['dia']) ? $_GET['dia'] : strtolower(date('l')); // 'lunes', 'martes'...
    // Normaliza el día (en español)
    $dias = [
        'monday' => 'lunes',
        'tuesday' => 'martes',
        'wednesday' => 'miercoles',
        'thursday' => 'jueves',
        'friday' => 'viernes',
        'saturday' => 'sabado',
        'sunday' => 'domingo'
    ];
    if (isset($dias[$dia])) $dia = $dias[$dia];
    $materias = Asistencia::obtenerMateriasYHorariosHoy($usuario_id, $dia);
    echo json_encode($materias);
    exit;
}
