// backend/src/api/middlewares/tenant.middleware.js
import Tenant from "../models/Tenant.js";
import { getTenantConnection } from "../../config/database.js";
import { defineUserModel } from "../models/Usuario.js"; // Importa la función para definir el modelo de usuario
import { defineProductoModel } from "../models/Producto.js"; // Importa la función para definir el modelo de producto

export const tenantMiddleware = async (req, res, next) => {
  try {
    const subdomain = req.headers["x-tenant-id"];
    if (!subdomain) {
      return res
        .status(400)
        .json({ message: "Cabecera X-Tenant-ID no especificada." });
    }

    const tenant = await Tenant.findOne({ where: { subdomain } });
    if (!tenant) {
      return res
        .status(404)
        .json({ message: `La empresa '${subdomain}' no fue encontrada.` });
    }

    req.tenant = tenant;
    const tenantDbConnection = getTenantConnection(tenant.dbName); // --- CORRECCIÓN CRÍTICA AQUÍ ---
    // Define los modelos en la conexión específica del inquilino
    // Y adjúntalos a la solicitud para que los controladores puedan usarlos
    req.tenantConnection = tenantDbConnection; // Asegura que la conexión esté disponible
    req.tenantModels = {
      User: defineUserModel(tenantDbConnection),
      Producto: defineProductoModel(tenantDbConnection),
    };
    req.subdomain = subdomain;
    next();
  } catch (error) {
    console.error("Error en el middleware de inquilino:", error);
    return res
      .status(500)
      .json({ message: "Error al procesar la petición del inquilino." });
  }
};
