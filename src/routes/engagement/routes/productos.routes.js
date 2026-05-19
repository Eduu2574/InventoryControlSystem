import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/productos', verifyToken, productosController.getProductos);

router.get('/productos/:id/movimientos',verifyToken,productosController.obtenerMovimientos);

router.post('/productos', verifyToken, productosController.crearProducto);
router.patch('/productos/:id/stock',verifyToken, productosController.cambiarStock);
router.patch('/productos/:id',verifyToken, productosController.editarProducto);
router.delete('/productos/:id', verifyToken, productosController.eliminarProducto);
router.get('/movimientos',verifyToken,productosController.obtenerMovimientosGlobal);
export default router;