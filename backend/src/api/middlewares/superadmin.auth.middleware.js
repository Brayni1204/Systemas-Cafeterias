// backend/src/api/middlewares/superadmin.auth.middleware.js
import jwt from 'jsonwebtoken';

export const protectSuperadmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, no hay token.' });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificamos que el token sea específicamente de un superadmin
    if (decoded.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso prohibido. No es un superadministrador.' });
    }

    req.superadmin = decoded; // Adjuntamos los datos del superadmin a la petición
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};