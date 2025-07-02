import { Router } from 'express';
import { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../controllers/usuario.controller.js';
import { protectTenantRoute } from '../middlewares/tenant.auth.middleware.js';

const router = Router();

// Todas las rutas aquí están protegidas y requieren autenticación de un usuario del inquilino
router.use(protectTenantRoute);

// Rutas para la gestión de usuarios
router.get('/', getUsuarios);
router.post('/', createUsuario);

router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;