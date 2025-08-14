import { Router } from "express";
import { createPedido } from "../controllers/pedido.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js";

const router = Router();
router.post("/pedidos", protectTenantRoute, createPedido);
export default router;
