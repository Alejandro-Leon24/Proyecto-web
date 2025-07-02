<?php
require_once __DIR__ . '/../Config/database.php';

/**
 * Clase Resumen para obtener un resumen de asistencias por materia para un usuario.
 */
class Resumen
{
    /**
     * Obtiene un resumen de asistencias por materia para un usuario específico.
     *
     * @param int $usuario_id El ID del usuario para el cual se obtendrá el resumen.
     * @return array Un array asociativo donde cada elemento representa una materia
     *               y contiene el ID de la materia, el nombre de la materia,
     *               el total de clases y el número de asistencias 'si'.
     *               Retorna un array vacío si no se encuentran datos.
     */
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