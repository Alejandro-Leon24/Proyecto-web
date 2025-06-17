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
    <meta name="viewport" content="width=650, user-scalable=no">
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
        <h1>Editar materias</h1>

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
                                    <form method="post" action="../Controlador/MateriaController.php" style="display:inline;">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="materia_id" value="<?= $m['id'] ?>">
                                        <button type="submit" class="cancelar-edicion" onclick="return confirm('¿Seguro que deseas eliminar esta materia?')">&#x2716;</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
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
                    <button type="submit" class="boton-confirmar">Confirmar</button>
                    <button type="button" class="cancelar-edicion" id="cancelar-btn">Cancelar</button>
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