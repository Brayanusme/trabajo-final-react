import { Router } from 'express'
import { historialUsuario, listarPrestamos, obtenerPrestamo, registrarDevolucion, registrarPrestamo } from '../controllers/prestamos.controller.js'
import { checkRole, verificarToken } from '../middleware/auth.middleware.js'

const router = Router()
router.get('/', verificarToken, checkRole('Administrador', 'Empleado'), listarPrestamos)
router.get('/mis-prestamos', verificarToken, historialUsuario)
router.get('/:id', verificarToken, obtenerPrestamo)
router.post('/', verificarToken, registrarPrestamo)
router.patch('/:id/devolucion', verificarToken, checkRole('Administrador', 'Empleado'), registrarDevolucion)

export default router
