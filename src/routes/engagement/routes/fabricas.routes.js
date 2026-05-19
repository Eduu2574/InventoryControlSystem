import { Router } from 'express';
import { getFabricas } from '../controllers/fabricas.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/fabricas', verifyToken, getFabricas);

export default router;