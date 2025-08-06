// backend/src/api/routes/auth.routes.js
import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js"; // Importa el middleware

const router = Router();

router.post("/login", login);

export default router;
