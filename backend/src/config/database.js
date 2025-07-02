// backend/src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Conexión a la base de datos principal que contiene la tabla de inquilinos
export const mainSequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desactivamos el logging para esta conexión
});

// Un mapa para guardar las conexiones de los inquilinos y no volver a crearlas
const tenantConnections = new Map();

export const getTenantConnection = (dbName) => {
  if (tenantConnections.has(dbName)) {
    return tenantConnections.get(dbName);
  }
  
  // Crea una nueva conexión para el inquilino específico
  const tenantSequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // Debes añadir estas variables a tu .env
    dialect: 'postgres',
    logging: console.log, // Mantenemos el logging para las operaciones del inquilino
  });

  tenantConnections.set(dbName, tenantSequelize);
  return tenantSequelize;
};