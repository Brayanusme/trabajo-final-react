IF DB_ID(N'bd_biblioteca') IS NULL
    CREATE DATABASE bd_biblioteca;
GO

USE bd_biblioteca;
GO

CREATE TABLE roles (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nombre)
VALUES ('Administrador'), ('Empleado'), ('Cliente');

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombres NVARCHAR(50) NOT NULL,
    apellidos NVARCHAR(50) NOT NULL,
    tipo_documento NVARCHAR(10) NOT NULL,
    numero_documento NVARCHAR(15) NOT NULL UNIQUE,
    direccion NVARCHAR(100) NOT NULL,
    telefono NVARCHAR(10) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    estado NVARCHAR(10) NOT NULL DEFAULT N'Activo',
    fecha_registro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT ck_usuario_estado CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE libros (
    id_libro INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(150) NOT NULL,
    autor NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(100) NOT NULL,
    isbn NVARCHAR(20) NOT NULL UNIQUE,
    disponible BIT NOT NULL DEFAULT 1,
    imagen NVARCHAR(255),
    descripcion NVARCHAR(MAX),
    fecha_registro DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE prestamos (
    id_prestamo INT IDENTITY(1,1) PRIMARY KEY,
    id_libro INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE NULL,
    estado NVARCHAR(10) NOT NULL DEFAULT N'Prestado',
    CONSTRAINT ck_prestamo_estado CHECK (estado IN ('Prestado', 'Devuelto', 'Retrasado')),
    CONSTRAINT fk_prestamo_libro FOREIGN KEY (id_libro) REFERENCES libros(id_libro),
    CONSTRAINT fk_prestamo_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

INSERT INTO libros (titulo, autor, categoria, isbn, disponible, imagen, descripcion)
VALUES
(N'Cien años de soledad', N'Gabriel García Márquez', N'Novela', N'9780307474728', 1, N'libro1.jpg', N'Novela que narra la historia de varias generaciones de la familia Buendía.'),
(N'El principito', N'Antoine de Saint-Exupéry', N'Literatura', N'9780156012195', 1, N'libro4.jpg', N'Historia que aborda la amistad, el amor y el sentido de la vida.'),
(N'El Hobbit', N'J. R. R. Tolkien', N'Fantasía', N'9780547928227', 1, N'libro9.jpg', N'Aventura de Bilbo Bolsón por la Tierra Media.');

SELECT * FROM libros;
