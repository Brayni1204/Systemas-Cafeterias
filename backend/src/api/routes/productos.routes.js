// backend/src/api/routes/productos.routes.js
import { Router } from 'express';
// --- CORRECCIÓN: Añadimos createProducto a la importación ---
import { getProductos, createProducto, updateProducto } from '../controllers/producto.controller.js'; 
import { protectTenantRoute } from '../middlewares/tenant.auth.middleware.js';

const router = Router();

router.get('/productos', protectTenantRoute, getProductos);
router.post('/productos', protectTenantRoute, createProducto); // Ahora 'createProducto' es reconocido
// --- RUTA AÑADIDA ---
router.put('/productos/:id', protectTenantRoute, updateProducto);


export default router;