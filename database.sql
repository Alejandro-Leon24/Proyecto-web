-- Script de creación de la base de datos para el sistema de Registro de Asistencia

CREATE DATABASE asistencia_db;
USE asistencia_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255),
    fecha_nacimiento DATE,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta DATETIME DEFAULT NULL
);

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(100),
    profesor VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT,
    dia VARCHAR(20),
    hora_inicio TIME,
    hora_fin TIME,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

CREATE TABLE asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT,
    usuario_id INT,
    fecha DATE,
    dia VARCHAR(20),
    hora_inicio TIME,
    hora_fin TIME,
    asistio ENUM('si','no'),
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);