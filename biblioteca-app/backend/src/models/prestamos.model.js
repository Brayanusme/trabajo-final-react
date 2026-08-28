import pool from '../config/db.js'

export const obtenerPrestamos = async () => {
  const [rows] = await pool.execute(`SELECT p.id_prestamo, p.id_libro, p.id_usuario, p.fecha_prestamo, p.fecha_devolucion, p.estado, l.titulo AS libro, l.autor, u.nombres, u.apellidos, u.email FROM prestamos p INNER JOIN libros l ON p.id_libro = l.id_libro INNER JOIN usuarios u ON p.id_usuario = u.id_usuario ORDER BY p.id_prestamo DESC`)
  return rows
}

export const obtenerPrestamoPorId = async (id) => {
  const [rows] = await pool.execute(`SELECT p.id_prestamo, p.id_libro, p.id_usuario, p.fecha_prestamo, p.fecha_devolucion, p.estado, l.titulo AS libro, l.autor, u.nombres, u.apellidos, u.email FROM prestamos p INNER JOIN libros l ON p.id_libro = l.id_libro INNER JOIN usuarios u ON p.id_usuario = u.id_usuario WHERE p.id_prestamo = ?`, [id])
  return rows[0]
}

export const obtenerPrestamosPorUsuario = async (idUsuario) => {
  const [rows] = await pool.execute(`SELECT p.id_prestamo, p.id_libro, p.fecha_prestamo, p.fecha_devolucion, p.estado, l.titulo AS libro, l.autor FROM prestamos p INNER JOIN libros l ON p.id_libro = l.id_libro WHERE p.id_usuario = ? ORDER BY p.id_prestamo DESC`, [idUsuario])
  return rows
}

export const crearPrestamo = async (idLibro, idUsuario, fechaPrestamo) => {
  const [resultado] = await pool.execute(`INSERT INTO prestamos (id_libro, id_usuario, fecha_prestamo, estado) OUTPUT INSERTED.id_prestamo AS id_prestamo VALUES (?, ?, ?, 'Prestado')`, [idLibro, idUsuario, fechaPrestamo])
  return resultado.insertId
}

export const devolverPrestamo = async (idPrestamo, fechaDevolucion) => {
  const [resultado] = await pool.execute(`UPDATE prestamos SET fecha_devolucion = ?, estado = 'Devuelto' WHERE id_prestamo = ? AND estado = 'Prestado'`, [fechaDevolucion, idPrestamo])
  return resultado.affectedRows
}
