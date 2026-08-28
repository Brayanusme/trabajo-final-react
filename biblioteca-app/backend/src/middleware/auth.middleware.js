import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ mensaje: 'Token de autenticación requerido.' })
    const partes = authorization.split(' ')
    if (partes.length !== 2 || partes[0] !== 'Bearer') return res.status(401).json({ mensaje: 'Formato de token inválido.' })
    req.user = jwt.verify(partes[1], process.env.JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' })
  }
}

export const checkRole = (...rolesPermitidos) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ mensaje: 'Usuario no autenticado.' })
  if (!rolesPermitidos.includes(req.user.rol)) return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción.' })
  return next()
}
