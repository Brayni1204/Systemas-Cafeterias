import { Router } from "express";
import {
  crearPreferenciaPago,
  recibirWebhook,
} from "../controllers/pago.controller.js";
import { protectTenantRoute } from "../middlewares/tenant.auth.middleware.js";

const router = Router();

// Ruta protegida para que un usuario cree una orden de pago
router.post(
  "/pagos/crear-preferencia",
  protectTenantRoute,
  crearPreferenciaPago
);

// Ruta PÚBLICA para que el servidor de Mercado Pago nos notifique (webhook)
router.post("/pagos/webhook", recibirWebhook);

export default router;
