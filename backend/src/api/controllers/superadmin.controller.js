// backend/src/api/controllers/superadmin.controller.js
import { mainSequelize, getTenantConnection } from '../../config/database.js';
import Tenant from '../models/Tenant.js';
import { defineUserModel } from '../models/Usuario.js';
// ¡Importante! Ahora importamos la nueva función del modelo de productos
import { defineProductoModel } from '../models/Producto.js';
import { defineClienteModel } from "../models/Cliente.js";
import { definePedidoModel } from "../models/Pedido.js";
import { defineDetallePedidoModel } from "../models/DetallePedido.js";

export const createTenant = async (req, res) => {
  const { subdomain, companyName, adminEmail, adminPassword } = req.body;
  const dbName = `tenant_${subdomain.replace(/-/g, '_')}`;

  const transaction = await mainSequelize.transaction();

  try {
    await mainSequelize.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos ${dbName} creada.`);
    
    const tenantConnection = getTenantConnection(dbName);
    
    // Define y sincroniza los modelos para el nuevo inquilino
    const Usuario = defineUserModel(tenantConnection);
    const Producto = defineProductoModel(tenantConnection); // <-- AÑADIDO
    const Cliente = defineClienteModel(tenantConnection);
    const Pedido = definePedidoModel(tenantConnection);
    const DetallePedido = defineDetallePedidoModel(tenantConnection);
    
    
    await Usuario.sync({ alter: true });
    await Producto.sync({ alter: true }); // <-- AÑADIDO
    await Cliente.sync({ alter: true });
    await Pedido.sync({ alter: true });
    await DetallePedido.sync({ alter: true });
    
    console.log(`Tablas (usuarios, productos) creadas en la base de datos ${dbName}.`);

    await Usuario.create({
      nombre: `Admin ${companyName}`,
      email: adminEmail,
      password: adminPassword,
      rol: 'administrador',
    });
    console.log(`Usuario administrador creado para ${dbName}.`);

    await Tenant.create({ subdomain, dbName, companyName}, { transaction });
    console.log(`Inquilino ${subdomain} guardado en la tabla 'tenants'.`);

    await transaction.commit();

    res.status(201).json({
      message: 'Empresa creada con éxito.',
      subdomain,
      dbName,
    });
  } catch (error) {
    console.error('Error al crear la empresa:', error);
    await transaction.rollback();
    res.status(500).json({ message: 'Error interno al crear la empresa.', error: error.message });
  }
};