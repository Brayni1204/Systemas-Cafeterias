// backend/src/api/routes/user.routes.js
import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js"; // Importa el middleware de protección

const router = Router();

// Aplica el middleware de protección a todas las rutas del CRUD de usuarios
router.get("/users", protectTenantRoute, getUsers); // Protegida
router.get("/users/:id", protectTenantRoute, getUserById); // Protegida
router.post("/users", protectTenantRoute, createUser); // Protegida
router.put("/users/:id", protectTenantRoute, updateUser); // Protegida
router.delete("/users/:id", protectTenantRoute, deleteUser); // Protegida

export default router;
