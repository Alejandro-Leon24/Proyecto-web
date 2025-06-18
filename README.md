# 🎓 Aplicación Web - Registro de Asistencia

Aplicación web para registrar y consultar asistencias académicas de manera eficiente, con gestión de materias y resúmenes individuales por usuario. El sistema está desarrollado en **PHP** y utiliza **MySQL/MariaDB** como base de datos, asegurando integridad, seguridad y multiusuario.

---

## 🌐 Acceso rápido al sistema

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=Registro de Asistencia/index.php" />
  </head>
  <body>
    <p>Redirigiendo a <a href="Registro de Asistencia/index.php">Registro de Asistencia/index.php</a></p>
  </body>
</html>
```

---

## 🧩 Tecnologías utilizadas

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP (estilo MVC)
- **Base de datos:** MySQL/MariaDB
- **Control de versiones:** Git + GitHub

---

## ⚙️ Versiones y requisitos del sistema

Este proyecto ha sido probado y funciona correctamente con la siguiente configuración recomendada:

- **Servidor de base de datos:**  
  - MariaDB 10.4.32 (o compatible con MySQL 5.7+)
  - Conjunto de caracteres: UTF-8 Unicode (utf8mb4)
- **Servidor web:**  
  - Apache/2.4.58 (Win64)  
  - PHP 8.2.12
- **phpMyAdmin:**  
  - 5.2.1 o superior

---

## 🔧 Instalación y ejecución local

Sigue estos pasos para instalar y levantar el sistema en tu equipo:

### 1. Clona este repositorio

```bash
git clone https://github.com/Alejandro-Leon24/Proyecto-web.git
```

### 2. Importa la base de datos

Ejecuta el script `database.sql` en tu gestor de bases de datos (phpMyAdmin) para crear la estructura y los datos iniciales.

### 3. Configuración del proyecto

El sistema utiliza un archivo de configuración para la conexión a la base de datos (`Registro de Asistencia/Config/database.php`).  
Por defecto la conexión está preparada para funcionar con un entorno local típico (localhost, puerto 3306, usuario `root`, sin contraseña):

```php
$host = 'localhost';
$port = '3306';
$db   = 'asistencia_db'; // Cambia este nombre si tu base de datos es diferente
$user = 'root';
```

**No necesitas modificar esta configuración** si:

- Usas XAMPP y tienes MariaDB/MySQL en localhost (puerto 3306).
- Tu usuario es `root` y no tienes contraseña.
- El nombre de la base de datos es `asistencia_db`.

Si tu configuración es distinta, edita los parámetros del archivo `Config/database.php` para que coincidan con tu entorno.

---

## 📱 Instalación como app en tu dispositivo

Puedes instalar la aplicación en tu escritorio o móvil simplemente añadiéndola a tu pantalla de inicio desde el navegador, gracias a la presencia del archivo `manifest.json`. No requiere pasos adicionales.

---

## ✨ Características principales

- Registro y edición de materias, días y horarios personalizados.
- Registro diario de asistencias por usuario y materia.
- Consulta de asistencias por semana/mes con filtros intuitivos.
- Resumen general de asistencias y alertas por bajo porcentaje.
- Interfaz responsiva y accesible.
- Instalación tipo app desde el navegador.

---

## 📦 Estructura del proyecto

```
Registro de Asistencia/
├── assets/             # Recursos estáticos (CSS, JS, imágenes)
├── Config/             # Configuración de base de datos
├── Controlador/        # Lógica de negocio y rutas (PHP)
├── Modelo/             # Acceso y lógica de datos (PHP)
├── Vista/              # Vistas y plantillas HTML/PHP
├── manifest.json       # Manifest para instalación tipo app
├── index.php           # Página principal para registrar la asistencia
└── README.md
```

---

## 🗄️ Estructura de la base de datos (resumen)

- **usuarios**: Información de usuario, login seguro, bloqueo tras intentos fallidos.
- **materias**: Materias creadas por cada usuario.
- **horarios**: Días y horas para cada materia.
- **asistencias**: Registros diarios de asistencia por materia y usuario.

**Relaciones:**  
Cada usuario puede tener varias materias; cada materia, varios horarios; las asistencias se relacionan con materias y usuarios.

---

## 👥 Integrantes

- **CRESPO ARIAS DENISSE KAROLINA**
- **ESTEVES VALERO ARIANNA LISBETH**
- **LEON SALAZAR XAVIER ALEJANDRO**
- **MEHLER CASTRO NATASHA VICTORIA**
- **MONAR ZAMBRANO NOHELYA CAROLINA**

---