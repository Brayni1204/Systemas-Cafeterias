// backend/src/api/routes/user.routes.js
import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js";

const router = Router();

// Cambiado el nombre del parámetro a :id_usuario para consistencia
router.get("/users", protectTenantRoute, getUsers);
router.get("/users/:id_usuario", protectTenantRoute, getUserById);
router.post("/users", protectTenantRoute, createUser);
router.put("/users/:id_usuario", protectTenantRoute, updateUser);
router.delete("/users/:id_usuario", protectTenantRoute, deleteUser);

export default router;
