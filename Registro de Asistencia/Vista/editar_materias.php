<?php
require_once __DIR__ . '/../Config/database.php';
require_once __DIR__ . '/../Modelo/Materia.php';
session_start();

if (!isset($_SESSION['usuario']['id'])) {
    header('Location: Login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

// Obtener materias y horarios del usuario desde el modelo
$materias = Materia::obtenerMateriasYHorariosPorUsuario($usuario_id);

// Obtener mensaje dependiendo del GET
$mensaje = Materia::mensajeGET($_GET);
?>
<script>
    window.usuarioLogeado = <?php echo isset($_SESSION['usuario']['id']) ? "true" : "false"; ?>;
</script>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Registro de Asistencia</title>
    <link rel="stylesheet" href="../assets/CSS/estilos.css">
</head>

<body>
    <!-- Menú hamburguesa -->
    <?php
    require_once "Layout/menu.php";
    ?>
    <!-- Contenedor principal donde inyectamos contenido -->
    <main>
        <h1 style="margin: 0;">Editar materias</h1>

        <div class="contenedor-editar-materias">
            <!-- Tabla -->
            <div class="contenedor-tabla">
                <?php if ($mensaje): ?>
                    <div style="max-width: 600px; margin: 15px auto;" class=notificacion><?= htmlspecialchars($mensaje) ?>
                    </div>
                <?php endif; ?>
                <table border="1" id="tabla-materias">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Días</th>
                            <th>Hora</th>
                            <th>Profesor</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($materias as $m):
                            // Inicializa los arrays para cada materia
                            $dias = [];
                            $horas = [];
                            foreach (explode(",", $m['horarios']) as $h) {
                                list($dia, $ini, $fin) = explode("|", $h);
                                $dias[] = ucfirst($dia);
                                // Solo hora y minutos
                                $horas[] = substr($ini, 0, 5) . " - " . substr($fin, 0, 5);
                            }
                        ?>
                            <tr>
                                <td><?= htmlspecialchars($m['nombre']) ?></td>
                                <td><?= htmlspecialchars(implode(", ", $dias)) ?></td>
                                <td><?= implode("<br>", array_map('htmlspecialchars', $horas)) ?></td>
                                <td><?= htmlspecialchars($m['profesor']) ?></td>
                                <td>
                                    <form method="post" action="../Controlador/MateriaController.php" style="display:inline; padding: 0;">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="materia_id" value="<?= $m['id'] ?>">
                                        <button type="submit" style="background: none;padding: 8px;" class="eliminar-materia" onclick="return confirm('¿Seguro que deseas eliminar esta materia?')">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="#e40000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.1s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.1s" values="8;0"/></path></g></svg>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <caption style="margin: 10px; font-weight: normal; opacity: 0.6;">Selecciona una fila de la tabla para editar la materia</caption>
                </table>
            </div>
            <!-- Formulario -->
            <div class="contenedor-formulario">
                <form id="form-materia" method="post" action="../Controlador/MateriaController.php">
                    <input type="hidden" name="accion" id="accion" value="agregar">
                    <input type="hidden" name="materia_id" id="materia_id" value="">
                    <label>Nombre de la materia:<br>
                        <input type="text" name="materia" id="nombre-materia" required>
                    </label>
                    <label>Días de asistencia:<br>
                        <select name="dias[]" id="dias-select" multiple size="3" required>
                            <option value="lunes">Lunes</option>
                            <option value="martes">Martes</option>
                            <option value="miercoles">Miércoles</option>
                            <option value="jueves">Jueves</option>
                            <option value="viernes">Viernes</option>
                            <option value="sabado">Sábado</option>
                            <option value="domingo">Domingo</option>
                        </select>
                        <small>Ctrl+clic o toque prolongado para seleccionar varios días.</small>
                    </label>
                    <div id="horarios-por-dia">
                        <div>
                            <label>Hora de inicio: <input type="time" disabled></label>
                            <label>Hora de fin: <input type="time" disabled></label>
                            <small>Selecciona un día para establecer el horario</small>
                        </div>
                    </div>
                    <label>Profesor:<br>
                        <input type="text" name="profesor" id="profesor" required>
                    </label>
                    <button type="submit" class="boton-confirmar" style="font-weight: 500;">Confirmar</button>
                    <button type="button" class="cancelar-edicion" id="cancelar-btn" style="font-weight: 500;">Cancelar</button>
                </form>
            </div>
        </div>
    </main>

    <script type="module" src="../assets/JS/main.js"></script>
    <?php
    include_once "../Controlador/EventoTabla.php";
    ?>
</body>

</html>