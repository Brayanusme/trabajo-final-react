import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { verificarToken } from '../middleware/auth.middleware.js'

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/perfil', verificarToken, (req, res) => res.json({ mensaje: 'Token válido.', usuario: req.user }))

export default router
