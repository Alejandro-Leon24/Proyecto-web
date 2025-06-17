<?php
require_once __DIR__ . '/../Controlador/ResumenController.php';
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=720, user-scalable=no">
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
            <table border="1">
                <thead>
                    <tr id="encabezado-resumen">
                        <th>Materia</th>
                        <?php foreach ($resumen as $r): ?>
                            <th><?= htmlspecialchars($r['materia']); ?></th>
                        <?php endforeach; ?>
                    </tr>
                    <tr id="totales-resumen">
                        <th>Asistencias</th>
                        <?php foreach ($resumen as $r): ?>
                            <td><?= (int)$r['asistencias_si']; ?></td>
                        <?php endforeach; ?>
                    </tr>
                    <tr id="clases-resumen">
                        <th>Total clases</th>
                        <?php foreach ($resumen as $r): ?>
                            <td><?= (int)$r['total_clases']; ?></td>
                        <?php endforeach; ?>
                    </tr>
                    <tr id="porcentaje-resumen">
                        <th>% Asistencia</th>
                        <?php foreach ($resumen as $r): ?>
                            <td>
                                <?= ($r['total_clases'] > 0) ? round(($r['asistencias_si'] / $r['total_clases']) * 100) . '%' : '0%' ?>
                            </td>
                        <?php endforeach; ?>
                    </tr>
                </thead>
            </table>
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