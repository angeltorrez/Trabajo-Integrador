import express from 'express';
import jwt from 'jsonwebtoken';
import EmployesModel from '../models/Employes.js';
import { asyncHandler } from '../utils.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Verify access token; if missing, try refresh token and issue new access token
const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.legajo = decoded.legajo;
      req.rol = decoded.rol;
      return next();
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.json({ valid: false, message: 'No hay token' });

    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign({ legajo: decodedRefresh.legajo, rol: decodedRefresh.rol }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 60 * 1000, sameSite: 'lax' });
    req.legajo = decodedRefresh.legajo;
    req.rol = decodedRefresh.rol;
    return next();
  } catch (err) {
    console.warn('Token verification/refresh failed:', err?.message || err);
    return res.json({ valid: false, message: 'Token no valido' });
  }
};

// Dashboard info (requires token)
router.get('/dashboard', verifyToken, (req, res) => {
  return res.json({ valid: true, message: 'Acceso al dashboard exitoso', legajo: req.legajo, rol: req.rol });
});

// Login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { legajo, password } = req.body;
    if (!legajo || !password) return res.status(400).json({ Login: false, message: 'legajo and password required' });

    const user = await EmployesModel.findOne({ legajo }).lean();
    if (!user) return res.json({ message: 'Legajo incorrecto', Login: false });
    if (user.password !== password) return res.json({ message: 'Password incorrecto', Login: false });

    const accessToken = jwt.sign({ legajo: user.legajo, rol: user.rol }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ legajo: user.legajo, rol: user.rol }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2m' });

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 1000, sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 2 * 60 * 1000, sameSite: 'lax' });

    return res.json({ Login: true, message: 'Login exitoso' });
  })
);

// Logout: clear cookies
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax'});
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax'});
    return res.json({ logout: true });
  })
);

// Help request: employees can submit an email + description for admin support
router.post(
  '/help',
  asyncHandler(async (req, res) => {
    const { email, description } = req.body || {};
    if (!email || !description) return res.status(400).json({ ok: false, message: 'email and description required' });

    // For now we log the request. In future this can be persisted or sent by email to admins.
    console.info('Help request received:', { email, description });

    return res.json({ ok: true, message: 'Solicitud recibida. Gracias.' });
  })
);

export { verifyToken };
export default router;
