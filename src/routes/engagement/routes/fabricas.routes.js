import { Router } from 'express';
import fabricasController from '../controllers/fabricas.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/fabricas', verifyToken, fabricasController.getFabricas);
router.post('/fabricas', verifyToken, fabricasController.crearFabrica);


export default router;