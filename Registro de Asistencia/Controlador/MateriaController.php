<?php
require_once __DIR__ . '/../Config/database.php';
require_once __DIR__ . '/../Modelo/Materia.php';
session_start();

if (!isset($_SESSION['usuario']['id'])) {
    header('Location: Login.php');
    exit;
}
$usuario_id = $_SESSION['usuario']['id'];

// AGREGAR MATERIA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'agregar') {
    $nombre = trim($_POST['materia']);
    $profesor = trim($_POST['profesor']);
    $dias = isset($_POST['dias']) ? $_POST['dias'] : [];
    if (!is_array($dias)) $dias = [$dias];

    $horariosNuevos = [];
    foreach ($dias as $dia) {
        $hora_inicio = $_POST["hora_inicio_$dia"];
        $hora_fin = $_POST["hora_fin_$dia"];
        $horariosNuevos[] = ['dia' => $dia, 'hora_inicio' => $hora_inicio, 'hora_fin' => $hora_fin];
    }

    // Validación solapamiento usando el modelo
    if (Materia::existeSolapamiento($usuario_id, $horariosNuevos)) {
        header("Location: ../Vista/editar_materias.php?error=solapamiento");
        exit;
    }

    // Insertar materia
    $stmt = $Conexion->prepare("INSERT INTO materias (usuario_id, nombre, profesor) VALUES (?, ?, ?)");
    $stmt->execute([$usuario_id, $nombre, $profesor]);
    $materia_id = $Conexion->lastInsertId();

    // Insertar horarios
    foreach ($dias as $dia) {
        $hora_inicio = $_POST["hora_inicio_$dia"];
        $hora_fin = $_POST["hora_fin_$dia"];
        $stmt2 = $Conexion->prepare("INSERT INTO horarios (materia_id, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)");
        $stmt2->execute([$materia_id, $dia, $hora_inicio, $hora_fin]);
    }
    header("Location: ../Vista/editar_materias.php?ok=agregado");
    exit;
}

// EDITAR MATERIA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'editar' && isset($_POST['materia_id'])) {
    $materia_id = intval($_POST['materia_id']);
    $nombre = trim($_POST['materia']);
    $profesor = trim($_POST['profesor']);
    $dias = isset($_POST['dias']) ? $_POST['dias'] : [];
    if (!is_array($dias)) $dias = [$dias];

    $horariosNuevos = [];
    foreach ($dias as $dia) {
        $hora_inicio = $_POST["hora_inicio_$dia"];
        $hora_fin = $_POST["hora_fin_$dia"];
        $horariosNuevos[] = ['dia' => $dia, 'hora_inicio' => $hora_inicio, 'hora_fin' => $hora_fin];
    }

    // Validación de solapamiento excluyendo la materia actual
    if (Materia::existeSolapamiento($usuario_id, $horariosNuevos, $materia_id)) {
        header("Location: ../Vista/editar_materias.php?error=solapamiento");
        exit;
    }

    // Actualiza materia
    $stmt = $Conexion->prepare("UPDATE materias SET nombre=?, profesor=? WHERE id=? AND usuario_id=?");
    $stmt->execute([$nombre, $profesor, $materia_id, $usuario_id]);

    // --- NUEVO BLOQUE PARA EDITAR HORARIOS SIN PERDER ID ---
    // 1. Leer horarios actuales
    $stmt = $Conexion->prepare("SELECT id, dia FROM horarios WHERE materia_id=?");
    $stmt->execute([$materia_id]);
    $horariosDB = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $horariosDBMap = [];
    foreach ($horariosDB as $h) {
        $horariosDBMap[$h['dia']] = $h['id'];
    }

    // 2. Procesar los horarios recibidos
    $nuevosDias = [];
    foreach ($dias as $dia) {
        $hora_inicio = $_POST["hora_inicio_$dia"];
        $hora_fin = $_POST["hora_fin_$dia"];
        $nuevosDias[] = $dia;

        if (isset($horariosDBMap[$dia])) {
            // Ya existe: actualizar
            $stmt2 = $Conexion->prepare("UPDATE horarios SET hora_inicio=?, hora_fin=? WHERE id=?");
            $stmt2->execute([$hora_inicio, $hora_fin, $horariosDBMap[$dia]]);
        } else {
            // Nuevo: insertar
            $stmt2 = $Conexion->prepare("INSERT INTO horarios (materia_id, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)");
            $stmt2->execute([$materia_id, $dia, $hora_inicio, $hora_fin]);
        }
    }

    // 3. Eliminar los horarios que ya no están en el formulario
    foreach ($horariosDB as $h) {
        if (!in_array($h['dia'], $nuevosDias)) {
            $stmt3 = $Conexion->prepare("DELETE FROM horarios WHERE id=?");
            $stmt3->execute([$h['id']]);
        }
    }

    header("Location: ../Vista/editar_materias.php?ok=editado");
    exit;
}

// ELIMINAR MATERIA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'eliminar' && isset($_POST['materia_id'])) {
    $materia_id = intval($_POST['materia_id']);
    $Conexion->prepare("DELETE FROM horarios WHERE materia_id=?")->execute([$materia_id]);
    $Conexion->prepare("DELETE FROM materias WHERE id=? AND usuario_id=?")->execute([$materia_id, $usuario_id]);
    header("Location: ../Vista/editar_materias.php?ok=eliminado");
    exit;
}

// Si no se reconoce la acción o método, redirige
header("Location: ../Vista/editar_materias.php");
exit;
?>