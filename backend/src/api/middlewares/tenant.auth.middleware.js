// backend/src/api/middlewares/tenant.auth.middleware.js
import jwt from 'jsonwebtoken';

export const protectTenantRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, no hay token.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol === 'superadmin') {
      return res.status(403).json({ message: 'Acceso prohibido. Ruta solo para usuarios de empresa.' });
    }
    req.user = decoded; // Adjuntamos los datos del usuario del inquilino
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};