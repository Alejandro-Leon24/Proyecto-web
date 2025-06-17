<?php
class Asistencia
{
    public static function obtenerAsistenciaDelDia($usuario_id, $materia_id, $dia, $fecha)
    {
        global $Conexion;
        $stmt = $Conexion->prepare("SELECT * FROM asistencias WHERE usuario_id=? AND materia_id=? AND dia=? AND DATE(fecha)=?");
        $stmt->execute([$usuario_id, $materia_id, $dia, $fecha]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function registrarAsistencia($usuario_id, $materia_id, $asistio, $dia, $hora_inicio, $hora_fin, $fecha = null)
    {
        global $Conexion;
        if ($fecha === null) $fecha = date('Y-m-d H:i:s');
        $stmt = $Conexion->prepare(
            "INSERT INTO asistencias (usuario_id, materia_id, asistio, dia, hora_inicio, hora_fin, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        return $stmt->execute([$usuario_id, $materia_id, $asistio, $dia, $hora_inicio, $hora_fin, $fecha]);
    }

    public static function obtenerMateriasYHorariosHoy($usuario_id, $dia)
    {
        global $Conexion;
        $stmt = $Conexion->prepare(
            "SELECT m.id, m.nombre, m.profesor, h.dia, h.hora_inicio, h.hora_fin
            FROM materias m
            JOIN horarios h ON m.id = h.materia_id
            WHERE m.usuario_id=? AND h.dia=?"
        );
        $stmt->execute([$usuario_id, $dia]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function obtenerAsistenciasPorRango($usuario_id, $fecha_inicio, $fecha_fin)
    {
        global $Conexion;
        $sql = "SELECT a.fecha, a.asistio, a.dia, a.hora_inicio, a.hora_fin, m.nombre as materiaNombre
        FROM asistencias a
        JOIN materias m ON a.materia_id = m.id
        WHERE a.usuario_id = ? AND a.fecha BETWEEN ? AND ?
        ORDER BY m.nombre, a.fecha";
        $stmt = $Conexion->prepare($sql);
        $stmt->execute([$usuario_id, $fecha_inicio, $fecha_fin]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
