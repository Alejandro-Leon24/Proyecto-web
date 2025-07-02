<?php
class Asistencia
{
    /**
     * Obtiene la asistencia de un usuario para una materia en un día específico.
     *
     * @param int $usuario_id ID del usuario.
     * @param int $materia_id ID de la materia.
     * @param string $dia Día de la semana (e.g., 'Lunes').
     * @param string $fecha Fecha en formato YYYY-MM-DD.
     * @return array|false Un array asociativo con los datos de la asistencia, o false si no se encuentra.
     */
    public static function obtenerAsistenciaDelDia($usuario_id, $materia_id, $dia, $fecha)
    {
        global $Conexion;
        $stmt = $Conexion->prepare("SELECT * FROM asistencias WHERE usuario_id=? AND materia_id=? AND dia=? AND DATE(fecha)=?");
        $stmt->execute([$usuario_id, $materia_id, $dia, $fecha]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Registra la asistencia de un usuario a una materia.
     *
     * @param int $usuario_id ID del usuario.
     * @param int $materia_id ID de la materia.
     * @param int $asistio Indica si el usuario asistió (1) o no (0).
     * @param string $dia Día de la semana.
     * @param string $hora_inicio Hora de inicio de la clase.
     * @param string $hora_fin Hora de fin de la clase.
     * @param string|null $fecha Fecha y hora del registro (opcional, por defecto la fecha y hora actual).
     * @return bool True si la inserción fue exitosa, false en caso contrario.
     */

    public static function registrarAsistencia($usuario_id, $materia_id, $asistio, $dia, $hora_inicio, $hora_fin, $fecha = null)
    {
        global $Conexion;
        if ($fecha === null) $fecha = date('Y-m-d H:i:s');
        $stmt = $Conexion->prepare(
            "INSERT INTO asistencias (usuario_id, materia_id, asistio, dia, hora_inicio, hora_fin, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        return $stmt->execute([$usuario_id, $materia_id, $asistio, $dia, $hora_inicio, $hora_fin, $fecha]);
    }

    /**
     * Obtiene las materias y horarios del día actual para un usuario.
     *
     * @param int $usuario_id ID del usuario.
     * @param string $dia Día de la semana.
     * @return array Un array de arrays asociativos con los datos de las materias y horarios.
     */

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

    /**
     * Obtiene las asistencias de un usuario en un rango de fechas, incluyendo el nombre de la materia.
     *
     * @param int $usuario_id ID del usuario.
     * @param string $fecha_inicio Fecha de inicio del rango (YYYY-MM-DD).
     * @param string $fecha_fin Fecha de fin del rango (YYYY-MM-DD).
     * @return array Un array de arrays asociativos con los datos de las asistencias y el nombre de la materia.
     */

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
