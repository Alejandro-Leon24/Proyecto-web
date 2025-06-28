<?php
require_once __DIR__ . '/../Controlador/ResumenController.php';
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
    <script>
        window.usuarioLogeado = true;
    </script>
    <title>Registro de Asistencia</title>
</head>

<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>

    <main id="resumen-asistencia">
        <h1>Resumen de asistencia</h1>
        <?php if (empty($resumen)): ?>
            <div id="mensaje-resumen-vacio">Por ahora no hay asistencias registradas.</div>
        <?php else: ?>
            <div>
                <table border="1" style="margin-bottom: 20px">
                    <thead>
                        <tr id="encabezado-resumen">
                            
                            <th>Materia</th>
                            <th>Asistencias</th>
                            <th>Total clases</th>
                            <th>% Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($resumen as $r): ?>
                            <tr>
                                
                                <td><?= htmlspecialchars($r['materia']); ?></td>
                                <td><?= (int)$r['asistencias_si']; ?></td>
                                <td><?= (int)$r['total_clases']; ?></td>
                                <td>
                                    <?= ($r['total_clases'] > 0) ? round(($r['asistencias_si'] / $r['total_clases']) * 100) . '%' : '0%' ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <p id="reporte-asistencia">
                <?php
                $materiasBajas = [];
                foreach ($resumen as $r) {
                    if ($r['total_clases'] > 0 && ($r['asistencias_si'] / $r['total_clases']) < 0.6) {
                        $materiasBajas[] = $r['materia'];
                    }
                }
                if (count($materiasBajas) > 0) {
                    echo "Atención: asistencia baja en: " . implode(", ", $materiasBajas);
                } else {
                    echo "Tienes todas las asistencias completas.";
                }
                ?>
            </p>
            <p>
                <?php
                $totalAsistencias = array_sum(array_column($resumen, 'asistencias_si'));
                $totalClases = array_sum(array_column($resumen, 'total_clases'));
                $porcentajeGeneral = ($totalClases > 0) ? round($totalAsistencias / $totalClases * 100) : 0;
                echo "Total general de asistencias: $totalAsistencias de $totalClases ($porcentajeGeneral%)";
                ?>
            </p>
        <?php endif; ?>

    </main>
    <script type="module" src="../assets/JS/main.js"></script>
</body>

</html>