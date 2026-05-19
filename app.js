import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import routerStock from './src/routes/engagement/routerStock.js';
import productosRoutes from './src/routes/engagement/routes/productos.routes.js';
import userRoutes from './src/routes/engagement/routes/user.routes.js';
import authRoutes from './src/routes/engagement/routes/auth.routes.js';
import securityRoutes from './src/routes/engagement/security/security.js';
import chatbotRoutes from './src/routes/engagement/routes/chatbot.routes.js';
import fabricasRoutes from './src/routes/engagement/routes/fabricas.routes.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.APP_PORT || 4000;


// ✅ 1. PARSERS (ANTES DE LAS RUTAS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// LO AÑADO NUEVO 28/4 SE PUEDE BORRAR?
//app.use(express.static('public'));

// ✅ 2. VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// ✅ 3. ESTÁTICOS
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ✅ 4. ROUTERS (DESPUÉS DE LOS PARSERS)
app.use('/', routerStock);
console.log("APP.JS CARGADO");
app.use('/api', productosRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api/security', securityRoutes);
app.use('/api', chatbotRoutes);
app.use('/api', fabricasRoutes);

// ✅ 5. SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  
});