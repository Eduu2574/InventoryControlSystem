import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/user.model.js';
import { db } from '../db.js';

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).send('Email o contraseña incorrectos');
    }

    // 2️⃣ Verificar contraseña
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!validPassword) {
      return res.status(401).send('Email o contraseña incorrectos');
    }

    // 3️⃣ Crear JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 4️⃣ Guardar token en cookie SEGURA
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true en producción HTTPS
      sameSite: 'Strict',
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Error interno');
  }
}
// REGISTER


export async function register(req, res) {
  try {
    const {name, email, password} = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe: Email en uso' });
    }
    // Parsear contraseña a HASH
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    return res.status(201).json({ message: 'Usuario Creado' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
}