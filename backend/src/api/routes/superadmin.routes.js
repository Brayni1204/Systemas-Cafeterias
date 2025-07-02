// backend/src/api/routes/superadmin.routes.js
import { Router } from 'express';
import { createTenant } from '../controllers/superadmin.controller.js';
import { loginSuperadmin } from '../controllers/superadmin.auth.controller.js';
import { protectSuperadmin } from '../middlewares/superadmin.auth.middleware.js'; // <-- AÑADIDO

const router = Router();

router.post('/superadmin/login', loginSuperadmin);

// --- RUTA MODIFICADA ---
// Ahora, antes de ejecutar createTenant, se ejecuta el middleware protectSuperadmin
router.post('/superadmin/tenants', protectSuperadmin, createTenant); // <-- MODIFICADO

export default router;