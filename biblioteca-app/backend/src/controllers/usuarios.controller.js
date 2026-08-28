import { actualizarUsuario, buscarUsuarioPorDocumento, buscarUsuarioPorEmail, cambiarEstadoUsuario, eliminarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from '../models/usuarios.model.js'

const validarUsuario = (datos) => {
  const { nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, id_rol } = datos
  if (!nombres || !apellidos || !tipo_documento || !numero_documento || !direccion || !telefono || !email || !id_rol) return 'Todos los campos son obligatorios.'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombres)) return 'Los nombres solo pueden contener letras.'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidos)) return 'Los apellidos solo pueden contener letras.'
  if (!/^\d+$/.test(numero_documento) || numero_documento.length < 6 || numero_documento.length > 15) return 'El documento debe tener entre 6 y 15 números.'
  if (!/^\d+$/.test(telefono) || telefono.length < 7 || telefono.length > 10) return 'El teléfono debe tener entre 7 y 10 números.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'El correo electrónico no es válido.'
  if (![1, 2, 3].includes(Number(id_rol))) return 'El rol seleccionado no es válido.'
  return null
}

export const listarUsuarios = async (_req, res) => {
  try { const usuarios = await obtenerUsuarios(); return res.json({ cantidad: usuarios.length, usuarios }) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener los usuarios.' }) }
}

export const obtenerUsuario = async (req, res) => {
  try { const usuario = await obtenerUsuarioPorId(req.params.id); if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' }); return res.json(usuario) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener el usuario.' }) }
}

export const editarUsuario = async (req, res) => {
  try {
    if (!await obtenerUsuarioPorId(req.params.id)) return res.status(404).json({ mensaje: 'Usuario no encontrado.' })
    const error = validarUsuario(req.body)
    if (error) return res.status(400).json({ mensaje: error })
    if (await buscarUsuarioPorEmail(req.body.email, req.params.id)) return res.status(409).json({ mensaje: 'El correo electrónico ya pertenece a otro usuario.' })
    if (await buscarUsuarioPorDocumento(req.body.numero_documento, req.params.id)) return res.status(409).json({ mensaje: 'El número de documento ya pertenece a otro usuario.' })
    await actualizarUsuario(req.params.id, req.body)
    return res.json({ mensaje: 'Usuario actualizado correctamente.' })
  } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al actualizar el usuario.' }) }
}

export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body
    if (!['Activo', 'Inactivo'].includes(estado)) return res.status(400).json({ mensaje: 'El estado debe ser Activo o Inactivo.' })
    if (!await obtenerUsuarioPorId(req.params.id)) return res.status(404).json({ mensaje: 'Usuario no encontrado.' })
    await cambiarEstadoUsuario(req.params.id, estado)
    return res.json({ mensaje: `Usuario ${estado.toLowerCase()} correctamente.` })
  } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al cambiar el estado del usuario.' }) }
}

export const borrarUsuario = async (req, res) => {
  try {
    if (!await obtenerUsuarioPorId(req.params.id)) return res.status(404).json({ mensaje: 'Usuario no encontrado.' })
    if (Number(req.params.id) === Number(req.user.id_usuario)) return res.status(400).json({ mensaje: 'No puedes eliminar tu propio usuario.' })
    await eliminarUsuario(req.params.id)
    return res.json({ mensaje: 'Usuario eliminado correctamente.' })
  } catch (error) { console.error(error); return res.status(409).json({ mensaje: 'No se puede eliminar el usuario. Puede tener préstamos asociados.' }) }
}
