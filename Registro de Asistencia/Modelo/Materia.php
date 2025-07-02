<?php

/**
 * Clase Materia.
 *
 * Esta clase proporciona métodos estáticos para interactuar con la tabla 'materias' en la base de datos.
 * Incluye funcionalidades para obtener materias y sus horarios, verificar solapamientos de horarios,
 * y generar mensajes informativos basados en parámetros GET.
 */
class Materia
{
    /**
     * Obtiene todas las materias y sus horarios asociados para un usuario específico.
     *
     * @param int $usuario_id El ID del usuario.
     * @return array Un array asociativo donde cada elemento representa una materia con sus horarios concatenados.
     *               Los horarios se concatenan en un string con el formato 'dia|hora_inicio|hora_fin', separados por comas.
     */
    public static function obtenerMateriasYHorariosPorUsuario($usuario_id)
    {
        global $Conexion;
        $stmt = $Conexion->prepare(
            "SELECT m.*, GROUP_CONCAT(CONCAT(h.dia, '|', h.hora_inicio, '|', h.hora_fin) ORDER BY h.dia) AS horarios
            FROM materias m
            LEFT JOIN horarios h ON m.id = h.materia_id
            WHERE m.usuario_id=?
            GROUP BY m.id"
        );
        $stmt->execute([$usuario_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Verifica si los horarios proporcionados para una materia se solapan con los horarios de otras materias
     * existentes para el mismo usuario.
     *
     * @param int $usuario_id El ID del usuario.
     * @param array $horariosNuevos Un array de horarios nuevos a verificar, donde cada elemento debe tener las claves 'dia', 'hora_inicio' y 'hora_fin'.
     * @param int|null $materia_id (Opcional) El ID de la materia actual, útil para evitar la auto-comparación al editar una materia.
     * @return bool Retorna true si existe solapamiento de horarios, false en caso contrario.
     */

    public static function existeSolapamiento($usuario_id, $horariosNuevos, $materia_id = null)
    {
        global $Conexion;
        $query = "SELECT m.id, h.dia, h.hora_inicio, h.hora_fin
              FROM materias m
              JOIN horarios h ON m.id = h.materia_id
              WHERE m.usuario_id = ?";
        $params = [$usuario_id];
        if ($materia_id) {
            $query .= " AND m.id <> ?";
            $params[] = $materia_id;
        }
        $stmt = $Conexion->prepare($query);
        $stmt->execute($params);
        $materiasExistentes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Función auxiliar para convertir "HH:MM:SS" o "HH:MM" a decimal
        function timeToDecimal($time)
        {
            $parts = explode(':', $time);
            $hours = intval($parts[0]);
            $minutes = isset($parts[1]) ? intval($parts[1]) : 0;
            return $hours + ($minutes / 60);
        }

        // Función auxiliar para detectar solapamiento
        function horariosSeSolapan($h1_ini, $h1_fin, $h2_ini, $h2_fin)
        {
            // Convertir a decimales para comparación correcta
            $h1_ini_dec = timeToDecimal($h1_ini);
            $h1_fin_dec = timeToDecimal($h1_fin);
            $h2_ini_dec = timeToDecimal($h2_ini);
            $h2_fin_dec = timeToDecimal($h2_fin);

            // Permitir clases consecutivas (una termina cuando empieza la otra)
            if ($h1_fin_dec == $h2_ini_dec || $h2_fin_dec == $h1_ini_dec) {
                return false; // Consecutivos, NO se solapan
            }

            // Lógica original que SÍ funcionaba, pero con decimales
            return ($h1_ini_dec < $h2_fin_dec && $h1_fin_dec > $h2_ini_dec);
        }

        foreach ($horariosNuevos as $hNuevo) {
            foreach ($materiasExistentes as $hExist) {
                if (
                    $hNuevo['dia'] == $hExist['dia'] &&
                    horariosSeSolapan($hNuevo['hora_inicio'], $hNuevo['hora_fin'], $hExist['hora_inicio'], $hExist['hora_fin'])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Genera un mensaje informativo basado en los parámetros GET recibidos.
     *
     * @param array $get El array $_GET.
     * @return string Un mensaje informativo dependiendo de los parámetros 'ok' o 'error' en el array $_GET.
     *                Retorna una cadena vacía si no se encuentran parámetros relevantes.
     */

    public static function mensajeGET($get)
    {
        if (isset($get['ok'])) {
            if ($get['ok'] == 'agregado') return "Materia agregada correctamente.";
            if ($get['ok'] == 'editado') return "Materia editada correctamente.";
            if ($get['ok'] == 'eliminado') return "Materia eliminada correctamente.";
        }
        if (isset($get['error']) && $get['error'] == 'solapamiento') {
            return "Error: Los horarios se solapan con otra materia.";
        }
        return "";
    }
}
