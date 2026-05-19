//Importamos los módulos necesarios
import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';

//Creamos una instancia del router
const router = Router();

//Definimos las rutas POSTs
router.post('/auth/login', login);
router.post('/auth/register', register);

//Exportamos el módulo
export default router;
