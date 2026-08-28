import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { buscarUsuarioPorEmail, buscarUsuarioPorDocumento, crearUsuario } from '../models/usuario.model.js'

const validarRegistro = (datos) => {
  const { nombres, apellidos, tipo_documento, numero_documento, direccion, telefono, email, password } = datos
  if (!nombres || !apellidos || !tipo_documento || !numero_documento || !direccion || !telefono || !email || !password) return 'Todos los campos son obligatorios.'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombres)) return 'El nombre solo puede contener letras.'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidos)) return 'El apellido solo puede contener letras.'
  if (!/^\d+$/.test(numero_documento) || numero_documento.length < 6 || numero_documento.length > 15) return 'El documento debe tener entre 6 y 15 números.'
  if (!/^\d+$/.test(telefono) || telefono.length < 7 || telefono.length > 10) return 'El teléfono debe tener entre 7 y 10 números.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'El correo electrónico no es válido.'
  if (password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.'
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener una mayúscula.'
  if (!/\d/.test(password)) return 'La contraseña debe contener un número.'
  return null
}

export const register = async (req, res) => {
  try {
    const datos = req.body
    const error = validarRegistro(datos)
    if (error) return res.status(400).json({ mensaje: error })
    if (await buscarUsuarioPorEmail(datos.email)) return res.status(409).json({ mensaje: 'El correo electrónico ya está registrado.' })
    if (await buscarUsuarioPorDocumento(datos.numero_documento)) return res.status(409).json({ mensaje: 'El número de documento ya está registrado.' })
    const passwordHash = await bcrypt.hash(datos.password, 10)
    const idUsuario = await crearUsuario({ ...datos, password: passwordHash, id_rol: 3 })
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente.', id_usuario: idUsuario })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' })
    const usuario = await buscarUsuarioPorEmail(email)
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' })
    if (usuario.estado !== 'Activo') return res.status(403).json({ mensaje: 'El usuario se encuentra inactivo.' })
    const token = jwt.sign({ id_usuario: usuario.id_usuario, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' })
    return res.json({ mensaje: 'Inicio de sesión exitoso.', token, usuario: { id_usuario: usuario.id_usuario, nombres: usuario.nombres, apellidos: usuario.apellidos, email: usuario.email, rol: usuario.rol } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}
