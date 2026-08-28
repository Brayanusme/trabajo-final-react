import { Router } from 'express'
import { actualizarEstado, borrarUsuario, editarUsuario, listarUsuarios, obtenerUsuario } from '../controllers/usuarios.controller.js'
import { checkRole, verificarToken } from '../middleware/auth.middleware.js'

const router = Router()
const adminOnly = [verificarToken, checkRole('Administrador')]
router.get('/', ...adminOnly, listarUsuarios)
router.get('/:id', ...adminOnly, obtenerUsuario)
router.put('/:id', ...adminOnly, editarUsuario)
router.patch('/:id/estado', ...adminOnly, actualizarEstado)
router.delete('/:id', ...adminOnly, borrarUsuario)

export default router
