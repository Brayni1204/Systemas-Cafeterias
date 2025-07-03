// backend/src/app.js
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { mainSequelize } from './config/database.js';

// Modelos
import Tenant from './api/models/Tenant.js'; 
import Superadmin from './api/models/Superadmin.js';

// Rutas
import superadminRoutes from './api/routes/superadmin.routes.js';
import productoRoutes from './api/routes/productos.routes.js';
import authRoutes from './api/routes/auth.routes.js';

// Middlewares
import { tenantMiddleware } from './api/middlewares/tenant.middleware.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || /localhost:5174$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set('io', io);
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- REGISTRO DE RUTAS CORREGIDO ---
app.use('/api', superadminRoutes);

// UNA SOLA LÍNEA para registrar TODAS las rutas del inquilino.
app.use('/api/v1', tenantMiddleware, [productoRoutes, authRoutes]);

// Lógica de Conexión de WebSockets...
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado vía WebSocket:', socket.id);
  socket.on('join_tenant_room', (tenantRoom) => {
    socket.join(tenantRoom);
    console.log(`Socket ${socket.id} se ha unido a la sala: ${tenantRoom}`);
  });
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const createInitialSuperadmin = async () => { /* ... tu función existente ... */ };

async function main() {
  try {
    await mainSequelize.sync({ alter: true });
    console.log('Conexión con la BD principal establecida y tablas sincronizadas.');
    await createInitialSuperadmin();
    server.listen(PORT, () => {
      console.log(`Backend server (con WebSockets) está corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos principal:', error);
  }
}

main();