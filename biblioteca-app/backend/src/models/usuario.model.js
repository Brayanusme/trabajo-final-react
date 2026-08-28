import pool from '../config/db.js'

export const buscarUsuarioPorEmail = async (email) => {
  const [rows] = await pool.execute(`SELECT TOP 1 u.id_usuario, u.nombres, u.apellidos, u.tipo_documento, u.numero_documento, u.direccion, u.telefono, u.email, u.password, u.estado, u.fecha_registro, r.id_rol, r.nombre AS rol FROM usuarios u INNER JOIN roles r ON u.id_rol = r.id_rol WHERE u.email = ?`, [email])
  return rows[0]
}

export const buscarUsuarioPorDocumento = async (numeroDocumento) => {
  const [rows] = await pool.execute('SELECT TOP 1 id_usuario FROM usuarios WHERE numero_documento = ?', [numeroDocumento])
  return rows[0]
}

export const crearUsuario = async (usuario) => {
  const { nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password, id_rol } = usuario
  const [resultado] = await pool.execute(`INSERT INTO usuarios (nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password, id_rol) OUTPUT INSERTED.id_usuario AS id_usuario VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password, id_rol])
  return resultado.insertId
}
