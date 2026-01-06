import express from 'express';
import * as authController from './controllers/authController.js';
import { verifyToken } from './middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: "API Leila Cosméticos funcionando!" });
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/users/me', verifyToken, (req, res) => {
    res.json({
        message: "Você está autenticado!",
        userData: req.user
    });
});

export default router;