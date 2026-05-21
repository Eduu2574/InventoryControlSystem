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

import express from 'express';
import pool from './db.js'; // ✅ nuevo


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4000; // ✅ importante

// ✅ PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// ✅ ESTÁTICOS
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ✅ ROUTES
app.use('/', routerStock);
app.use('/api', productosRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api/security', securityRoutes);
app.use('/api', chatbotRoutes);
app.use('/api', fabricasRoutes);

// ✅ TEST DB
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ SERVER
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
});