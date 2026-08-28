import pool from '../config/db.js'

export const obtenerLibros = async () => {
  const [rows] = await pool.execute(`SELECT id_libro, titulo, autor, categoria, isbn, disponible, imagen, descripcion, fecha_registro FROM libros ORDER BY id_libro DESC`)
  return rows
}

export const obtenerLibroPorId = async (id) => {
  const [rows] = await pool.execute(`SELECT id_libro, titulo, autor, categoria, isbn, disponible, imagen, descripcion, fecha_registro FROM libros WHERE id_libro = ?`, [id])
  return rows[0]
}

export const buscarLibroPorISBN = async (isbn, excludeId = null) => {
  const query = excludeId ? 'SELECT TOP 1 id_libro FROM libros WHERE isbn = ? AND id_libro <> ?' : 'SELECT TOP 1 id_libro FROM libros WHERE isbn = ?'
  const values = excludeId ? [isbn, excludeId] : [isbn]
  const [rows] = await pool.execute(query, values)
  return rows[0]
}

export const crearLibro = async (libro) => {
  const { titulo, autor, categoria, isbn, disponible = true, imagen, descripcion } = libro
  const [resultado] = await pool.execute(`INSERT INTO libros (titulo, autor, categoria, isbn, disponible, imagen, descripcion) OUTPUT INSERTED.id_libro AS id_libro VALUES (?, ?, ?, ?, ?, ?, ?)`, [titulo, autor, categoria, isbn, disponible, imagen || null, descripcion || null])
  return resultado.insertId
}

export const actualizarLibro = async (id, libro) => {
  const { titulo, autor, categoria, isbn, disponible, imagen, descripcion } = libro
  const [resultado] = await pool.execute(`UPDATE libros SET titulo = ?, autor = ?, categoria = ?, isbn = ?, disponible = ?, imagen = ?, descripcion = ? WHERE id_libro = ?`, [titulo, autor, categoria, isbn, disponible, imagen || null, descripcion || null, id])
  return resultado.affectedRows
}

export const cambiarDisponibilidad = async (id, disponible) => {
  const [resultado] = await pool.execute('UPDATE libros SET disponible = ? WHERE id_libro = ?', [disponible, id])
  return resultado.affectedRows
}

export const eliminarLibro = async (id) => {
  const [resultado] = await pool.execute('DELETE FROM libros WHERE id_libro = ?', [id])
  return resultado.affectedRows
}

export const obtenerDisponibilidadLibro = async (id) => {
  const [rows] = await pool.execute('SELECT id_libro, titulo, disponible FROM libros WHERE id_libro = ?', [id])
  return rows[0]
}

export const actualizarDisponibilidadLibro = async (id, disponible) => {
  const [resultado] = await pool.execute('UPDATE libros SET disponible = ? WHERE id_libro = ?', [disponible, id])
  return resultado.affectedRows
}
