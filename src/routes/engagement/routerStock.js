import { Router } from 'express';
import { verifyToken } from './middlewares/auth.middleware.js';
import { login, register } from './controllers/auth.controller.js';
import productosController from './controllers/productos.controller.js';


const router = Router();

// Vistas
router.get('/', (req, res) => {
  res.render('login');
});
router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/mainPage', verifyToken, (req, res) => {
  res.render('dashboard');
});

router.get('/historial-movimientos', verifyToken, (req, res) => {
  res.render('historialMovimientos');
});

router.get('/reporte-saturacion', verifyToken, (req, res) => {
  res.render('reporteSaturacion');
});

router.get('/expedir-productos', verifyToken, (req, res) => {
  res.render('expedirProductos');
});

// Auth
router.post('/login', login);
router.post('/register', register);



export default router;