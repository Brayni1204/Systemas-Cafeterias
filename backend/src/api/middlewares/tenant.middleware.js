// backend/src/api/middlewares/tenant.middleware.js
import Tenant from '../models/Tenant.js';
import { getTenantConnection } from '../../config/database.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    const subdomain = req.headers['x-tenant-id'];
    if (!subdomain) {
      return res.status(400).json({ message: 'Cabecera X-Tenant-ID no especificada.' });
    }

    const tenant = await Tenant.findOne({ where: { subdomain } });
    if (!tenant) {
      return res.status(404).json({ message: `La empresa '${subdomain}' no fue encontrada.` });
    }

    req.tenant = tenant;
    const tenantDbConnection = getTenantConnection(tenant.dbName);
    
    // --- MEJORA: Adjuntamos la información a la petición para usarla después ---
    req.tenantDbConnection = tenantDbConnection;
    req.subdomain = subdomain; // <-- AÑADIDO
    
    next();
  } catch (error) {
    console.error('Error en el middleware de inquilino:', error);
    return res.status(500).json({ message: 'Error al procesar la petición del inquilino.' });
  }
};