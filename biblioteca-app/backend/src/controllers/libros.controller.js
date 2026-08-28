import { actualizarLibro, buscarLibroPorISBN, cambiarDisponibilidad, crearLibro, eliminarLibro, obtenerLibroPorId, obtenerLibros } from '../models/libros.model.js'

const validarLibro = (datos) => {
  const { titulo, autor, categoria, isbn } = datos
  if (!titulo?.trim() || !autor?.trim() || !categoria?.trim() || !isbn?.trim()) return 'Título, autor, categoría e ISBN son obligatorios.'
  if (titulo.length > 150) return 'El título no puede superar los 150 caracteres.'
  if (autor.length > 100) return 'El autor no puede superar los 100 caracteres.'
  if (categoria.length > 100) return 'La categoría no puede superar los 100 caracteres.'
  if (isbn.length > 20) return 'El ISBN no puede superar los 20 caracteres.'
  return null
}

export const listarLibros = async (_req, res) => {
  try { const libros = await obtenerLibros(); return res.json({ cantidad: libros.length, libros }) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener los libros.' }) }
}

export const obtenerLibro = async (req, res) => {
  try { const libro = await obtenerLibroPorId(req.params.id); if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado.' }); return res.json(libro) } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al obtener el libro.' }) }
}

export const registrarLibro = async (req, res) => {
  try {
    const error = validarLibro(req.body)
    if (error) return res.status(400).json({ mensaje: error })
    if (await buscarLibroPorISBN(req.body.isbn)) return res.status(409).json({ mensaje: 'Ya existe un libro con ese ISBN.' })
    const idLibro = await crearLibro(req.body)
    return res.status(201).json({ mensaje: 'Libro creado correctamente.', id_libro: idLibro })
  } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al crear el libro.' }) }
}

export const editarLibro = async (req, res) => {
  try {
    if (!await obtenerLibroPorId(req.params.id)) return res.status(404).json({ mensaje: 'Libro no encontrado.' })
    const error = validarLibro(req.body)
    if (error) return res.status(400).json({ mensaje: error })
    if (await buscarLibroPorISBN(req.body.isbn, req.params.id)) return res.status(409).json({ mensaje: 'Ya existe otro libro con ese ISBN.' })
    await actualizarLibro(req.params.id, req.body)
    return res.json({ mensaje: 'Libro actualizado correctamente.' })
  } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al actualizar el libro.' }) }
}

export const actualizarDisponibilidad = async (req, res) => {
  try {
    const { disponible } = req.body
    if (typeof disponible !== 'boolean') return res.status(400).json({ mensaje: 'El campo disponible debe ser true o false.' })
    if (!await obtenerLibroPorId(req.params.id)) return res.status(404).json({ mensaje: 'Libro no encontrado.' })
    await cambiarDisponibilidad(req.params.id, disponible)
    return res.json({ mensaje: 'Disponibilidad actualizada correctamente.' })
  } catch (error) { console.error(error); return res.status(500).json({ mensaje: 'Error al cambiar la disponibilidad.' }) }
}

export const borrarLibro = async (req, res) => {
  try {
    if (!await obtenerLibroPorId(req.params.id)) return res.status(404).json({ mensaje: 'Libro no encontrado.' })
    await eliminarLibro(req.params.id)
    return res.json({ mensaje: 'Libro eliminado correctamente.' })
  } catch (error) { console.error(error); return res.status(409).json({ mensaje: 'No se puede eliminar el libro. Puede tener préstamos asociados.' }) }
}
