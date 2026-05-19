import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.redirect('/');
  }
}