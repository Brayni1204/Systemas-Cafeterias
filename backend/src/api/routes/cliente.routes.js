import { Router } from "express";
import {
  createCliente,
  getClientes,
} from "../controllers/cliente.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js";

const router = Router();
router.post("/clientes", protectTenantRoute, createCliente);
router.get("/clientes", protectTenantRoute, getClientes);
export default router;
