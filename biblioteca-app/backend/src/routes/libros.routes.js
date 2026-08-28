import { Router } from 'express'
import { actualizarDisponibilidad, borrarLibro, editarLibro, listarLibros, obtenerLibro, registrarLibro } from '../controllers/libros.controller.js'
import { checkRole, verificarToken } from '../middleware/auth.middleware.js'

const router = Router()
router.get('/', verificarToken, listarLibros)
router.get('/:id', verificarToken, obtenerLibro)
router.post('/', verificarToken, checkRole('Administrador', 'Empleado'), registrarLibro)
router.put('/:id', verificarToken, checkRole('Administrador', 'Empleado'), editarLibro)
router.patch('/:id/disponibilidad', verificarToken, checkRole('Administrador', 'Empleado'), actualizarDisponibilidad)
router.delete('/:id', verificarToken, checkRole('Administrador'), borrarLibro)

export default router
