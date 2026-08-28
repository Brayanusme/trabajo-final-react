import pool from '../config/db.js'
import { obtenerPrestamos, obtenerPrestamoPorId, obtenerPrestamosPorUsuario } from '../models/prestamos.model.js'

const fechaActual = () => new Date().toISOString().split('T')[0]

export const listarPrestamos = async (_req, res) => {
  try { const prestamos = await obtenerPrestamos(); return res.json({ cantidad: prestamos.length, prestamos }) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener los préstamos.' }) }
}

export const obtenerPrestamo = async (req, res) => {
  try { const prestamo = await obtenerPrestamoPorId(req.params.id); if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado.' }); return res.json(prestamo) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener el préstamo.' }) }
}

export const registrarPrestamo = async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const { id_libro: idLibro } = req.body
    const idUsuario = req.user.id_usuario
    if (!idLibro) return res.status(400).json({ mensaje: 'El libro es obligatorio.' })
    await connection.beginTransaction()
    const [libros] = await connection.execute('SELECT id_libro, titulo, disponible FROM libros WITH (UPDLOCK, ROWLOCK) WHERE id_libro = ?', [idLibro])
    if (!libros.length) { await connection.rollback(); return res.status(404).json({ mensaje: 'El libro no existe.' }) }
    if (!libros[0].disponible) { await connection.rollback(); return res.status(409).json({ mensaje: 'El libro no está disponible actualmente.' }) }
    const [usuarios] = await connection.execute("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 'Activo'", [idUsuario])
    if (!usuarios.length) { await connection.rollback(); return res.status(404).json({ mensaje: 'El usuario no existe o está inactivo.' }) }
    const [resultado] = await connection.execute("INSERT INTO prestamos (id_libro, id_usuario, fecha_prestamo, estado) OUTPUT INSERTED.id_prestamo AS id_prestamo VALUES (?, ?, ?, 'Prestado')", [idLibro, idUsuario, fechaActual()])
    await connection.execute('UPDATE libros SET disponible = FALSE WHERE id_libro = ?', [idLibro])
    await connection.commit()
    return res.status(201).json({ mensaje: 'Préstamo registrado correctamente.', id_prestamo: resultado.insertId })
  } catch (error) { await connection.rollback(); console.error(error); return res.status(500).json({ mensaje: 'Error al registrar el préstamo.' }) } finally { connection.release() }
}

export const registrarDevolucion = async (req, res) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [prestamos] = await connection.execute('SELECT id_prestamo, id_libro, estado FROM prestamos WITH (UPDLOCK, ROWLOCK) WHERE id_prestamo = ?', [req.params.id])
    if (!prestamos.length) { await connection.rollback(); return res.status(404).json({ mensaje: 'Préstamo no encontrado.' }) }
    const prestamo = prestamos[0]
    if (prestamo.estado === 'Devuelto') { await connection.rollback(); return res.status(409).json({ mensaje: 'Este préstamo ya fue devuelto.' }) }
    const fechaDevolucion = fechaActual()
    await connection.execute("UPDATE prestamos SET fecha_devolucion = ?, estado = 'Devuelto' WHERE id_prestamo = ?", [fechaDevolucion, req.params.id])
    await connection.execute('UPDATE libros SET disponible = TRUE WHERE id_libro = ?', [prestamo.id_libro])
    await connection.commit()
    return res.json({ mensaje: 'Libro devuelto correctamente.', fecha_devolucion: fechaDevolucion })
  } catch (error) { await connection.rollback(); console.error(error); return res.status(500).json({ mensaje: 'Error al registrar la devolución.' }) } finally { connection.release() }
}

export const historialUsuario = async (req, res) => {
  try { const prestamos = await obtenerPrestamosPorUsuario(req.user.id_usuario); return res.json({ cantidad: prestamos.length, prestamos }) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener el historial.' }) }
}
