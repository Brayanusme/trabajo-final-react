import pool from '../config/db.js'

const userFields = `u.id_usuario, u.nombres, u.apellidos, u.tipo_documento, u.numero_documento, u.direccion, u.telefono, u.email, u.estado, u.fecha_registro, r.id_rol, r.nombre AS rol`

export const obtenerUsuarios = async () => {
  const [rows] = await pool.execute(`SELECT ${userFields} FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id_rol ORDER BY u.id_usuario DESC`)
  return rows
}

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.execute(`SELECT ${userFields} FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = ?`, [id])
  return rows[0]
}

export const buscarUsuarioPorEmail = async (email, idExcluir = null) => {
  const query = idExcluir ? 'SELECT TOP 1 id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?' : 'SELECT TOP 1 id_usuario FROM usuarios WHERE email = ?'
  const [rows] = await pool.execute(query, idExcluir ? [email, idExcluir] : [email])
  return rows[0]
}

export const buscarUsuarioPorDocumento = async (documento, idExcluir = null) => {
  const query = idExcluir ? 'SELECT TOP 1 id_usuario FROM usuarios WHERE numero_documento = ? AND id_usuario != ?' : 'SELECT TOP 1 id_usuario FROM usuarios WHERE numero_documento = ?'
  const [rows] = await pool.execute(query, idExcluir ? [documento, idExcluir] : [documento])
  return rows[0]
}

export const actualizarUsuario = async (id, usuario) => {
  const { nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, id_rol } = usuario
  const [result] = await pool.execute('UPDATE usuarios SET nombres = ?, apellidos = ?, tipo_documento = ?, numero_documento = ?, direccion = ?, telefono = ?, email = ?, id_rol = ? WHERE id_usuario = ?', [nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, id_rol, id])
  return result.affectedRows
}

export const cambiarEstadoUsuario = async (id, estado) => {
  const [result] = await pool.execute('UPDATE usuarios SET estado = ? WHERE id_usuario = ?', [estado, id])
  return result.affectedRows
}

export const eliminarUsuario = async (id) => {
  const [result] = await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id])
  return result.affectedRows
}
