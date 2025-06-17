<?php
class Materia {
    public static function obtenerMateriasYHorariosPorUsuario($usuario_id) {
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

    public static function existeSolapamiento($usuario_id, $horariosNuevos, $materia_id = null) {
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

        // Función auxiliar
        function horariosSeSolapan($h1_ini, $h1_fin, $h2_ini, $h2_fin) {
            return ($h1_ini < $h2_fin && $h1_fin > $h2_ini);
        }

        foreach ($horariosNuevos as $hNuevo) {
            foreach ($materiasExistentes as $hExist) {
                if ($hNuevo['dia'] == $hExist['dia'] &&
                    horariosSeSolapan($hNuevo['hora_inicio'], $hNuevo['hora_fin'], $hExist['hora_inicio'], $hExist['hora_fin'])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    public static function mensajeGET($get) {
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
?>