// backend/src/app.js
import express from 'express';
import cors from 'cors';
import http from 'http'; // <-- AÑADIDO: Módulo http de Node
import { Server } from 'socket.io'; // <-- AÑADIDO: Server de socket.io

// ... (el resto de tus imports)
import { mainSequelize } from './config/database.js';
import Tenant from './api/models/Tenant.js'; 
import Superadmin from './api/models/Superadmin.js';
import superadminRoutes from './api/routes/superadmin.routes.js';
import productoRoutes from './api/routes/productos.routes.js';
import authRoutes from './api/routes/auth.routes.js';

import usuarioRoutes from './api/routes/usuario.routes.js';

import { tenantMiddleware } from './api/middlewares/tenant.middleware.js';

const app = express();
// --- CAMBIO: Creamos un servidor http a partir de la app de Express ---
const server = http.createServer(app); 

// --- CAMBIO: Creamos una instancia de Socket.IO ---
/*   */
const io = new Server(server, {
  cors: {
    // Aceptará cualquier origen que termine en .localhost:5174, o localhost:5174
    origin: (origin, callback) => {
      if (!origin || /localhost:5174$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"]
  }
});

// Añadimos 'io' al objeto app para que esté disponible en toda la aplicación
app.set('io', io);

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', superadminRoutes);
app.use('/api/v1', tenantMiddleware, [productoRoutes, authRoutes]);

app.use('/api/v1', tenantMiddleware, [productoRoutes, authRoutes, usuarioRoutes]);

// --- Lógica de Conexión de WebSockets ---
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado vía WebSocket:', socket.id);

  // El cliente nos dirá a qué "sala" (room) unirse basado en su subdominio
  socket.on('join_tenant_room', (tenantRoom) => {
    socket.join(tenantRoom);
    console.log(`Socket ${socket.id} se ha unido a la sala: ${tenantRoom}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const createInitialSuperadmin = async () => {
  try {
    const count = await Superadmin.count();
    if (count > 0) {
      console.log('El superadministrador ya existe.');
      return;
    }
    await Superadmin.create({
      email: 'superadmin@system.com',
      password: 'superadmin', // En un sistema real, esto debería ser más seguro y cambiarse
    });
    console.log('Superadministrador inicial creado con éxito.');
  } catch (error) {
    console.error('Error al crear el superadministrador inicial:', error);
  }
}

async function main() {
  try {
    await Tenant.sync({ alter: true });
    await Superadmin.sync({ alter: true });
    console.log('Conexión con la base de datos principal establecida y tablas sincronizadas.');

    await createInitialSuperadmin();

    // --- CAMBIO: Usamos server.listen en lugar de app.listen ---
    server.listen(PORT, () => {
      console.log(`Backend server (con WebSockets) está corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos principal:', error);
  }
}

main();