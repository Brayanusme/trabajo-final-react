import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import librosRoutes from './routes/libros.routes.js'
import prestamosRoutes from './routes/prestamos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/libros', librosRoutes)
app.use('/api/v1/prestamos', prestamosRoutes)
app.use('/api/v1/usuarios', usuariosRoutes)

app.get('/', (_request, response) => {
  response.json({ mensaje: 'API de Biblioteca funcionando correctamente' })
})

app.get('/health', (_request, response) => {
  response.json({ estado: 'ok' })
})

export default app
