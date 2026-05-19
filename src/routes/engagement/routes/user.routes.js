import express from 'express';
import { getMe } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.get('/historial-movimientos', verifyToken, (req, res) => {
  res.render('historialMovimientos');
});
router.get('/reporte-saturacion', verifyToken, (req, res) => {
  res.render('reporteSaturacion');
});

export default router;