// backend/src/api/middlewares/tenant.middleware.js
import Tenant from "../models/Tenant.js";
import { getTenantConnection } from "../../config/database.js";
import { defineUserModel } from "../models/Usuario.js"; // Corrige el nombre de la función importada
import { defineProductoModel } from "../models/Producto.js"; // Importa la función para definir el modelo de producto
import { defineClienteModel } from "../models/Cliente.js";
import { definePedidoModel } from "../models/Pedido.js";
import { defineDetallePedidoModel } from "../models/DetallePedido.js";
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
    const tenantDbConnection = getTenantConnection(tenant.dbName); // --- CORRECCIÓN CRÍTICA AQUÍ --- // Define los modelos en la conexión específica del inquilino // Y adjúntalos a la solicitud para que los controladores puedan usarlos
    req.tenantConnection = tenantDbConnection; // Asegura que la conexión esté disponible
    const models = {
      // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
      Usuario: defineUserModel(tenantDbConnection), // Antes decía defineUsuarioModel
      // --- FIN DE LA CORRECCIÓN ---
      Producto: defineProductoModel(tenantDbConnection),
      Cliente: defineClienteModel(tenantDbConnection),
      Pedido: definePedidoModel(tenantDbConnection),
      DetallePedido: defineDetallePedidoModel(tenantDbConnection),
    };

    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });
    req.tenantModels = {
      ...models,
      sequelize: tenantDbConnection, // <--- ¡ESTA ES LA LÍNEA QUE FALTA!
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
