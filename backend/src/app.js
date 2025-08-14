// backend/src/app.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { mainSequelize } from "./config/database.js";
import bcrypt from "bcryptjs"; // Asegúrate de tener esta librería instalada

// Modelos
import Tenant from "./api/models/Tenant.js";
import Superadmin from "./api/models/Superadmin.js";

// Rutas
import superadminRoutes from "./api/routes/superadmin.routes.js";
import productoRoutes from "./api/routes/productos.routes.js";
import authRoutes from "./api/routes/auth.routes.js";
import userRoutes from "./api/routes/user.routes.js";
import pedidoRoutes from "./api/routes/pedidos.routes.js";
import clienteRoutes from "./api/routes/cliente.routes.js";
import pagoRoutes from "./api/routes/pagos.routes.js";

// Middlewares
import { tenantMiddleware } from "./api/middlewares/tenant.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || /localhost:5174$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", superadminRoutes);
app.use("/api/v1", pagoRoutes);
app.use("/api/v1", tenantMiddleware, [
  productoRoutes,
  authRoutes,
  userRoutes,
  pedidoRoutes,
  clienteRoutes,
]);

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado vía WebSocket:", socket.id);
  socket.on("join_tenant_room", (tenantRoom) => {
    socket.join(tenantRoom);
    console.log(`Socket ${socket.id} se ha unido a la sala: ${tenantRoom}`);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// ----------------------------------------------------
// IMPLEMENTACIÓN DE LA FUNCIÓN createInitialSuperadmin
// ----------------------------------------------------
const createInitialSuperadmin = async () => {
  try {
    const existingSuperadmin = await Superadmin.findOne({
      where: { email: "superadmin@system.com" },
    });
    if (!existingSuperadmin) {
      // Pasa la contraseña en texto plano. El hook del modelo la encriptará.
      await Superadmin.create({
        email: "superadmin@system.com",
        password: "superadmin", // <-- Cambiado a la contraseña en texto plano
      });
      console.log("Superadministrador inicial creado exitosamente.");
    } else {
      console.log(
        "El superadministrador inicial ya existe. No se creó uno nuevo."
      );
    }
  } catch (error) {
    console.error("Error al crear el superadministrador inicial:", error);
  }
};
// ----------------------------------------------------

async function main() {
  try {
    await mainSequelize.sync({ alter: true });
    console.log(
      "Conexión con la BD principal establecida y tablas sincronizadas."
    );
    await createInitialSuperadmin();
    server.listen(PORT, () => {
      console.log(
        `Backend server (con WebSockets) está corriendo en el puerto ${PORT}`
      );
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos principal:", error);
  }
}

main();
