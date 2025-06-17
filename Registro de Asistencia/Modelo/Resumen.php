<?php
require_once __DIR__ . '/../Config/database.php';

class Resumen
{
    public static function obtenerResumen($usuario_id)
    {
        global $Conexion;
        $stmt = $Conexion->prepare("
            SELECT 
                m.id AS materia_id,
                m.nombre AS materia,
                COUNT(a.id) AS total_clases,
                SUM(a.asistio = 'si') AS asistencias_si
            FROM materias m
            LEFT JOIN asistencias a 
                ON a.materia_id = m.id 
                AND a.usuario_id = :usuario_id
            WHERE m.usuario_id = :usuario_id
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ");
        $stmt->execute(['usuario_id' => $usuario_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}