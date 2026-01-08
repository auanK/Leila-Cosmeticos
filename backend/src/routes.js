import express from 'express';
import * as authController from './controllers/authController.js';
import * as categoryController from './controllers/categoryController.js';
import * as productController from './controllers/productController.js';
import * as cartController from './controllers/cartController.js';
import { verifyToken, requireAdmin } from './middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: "API Leila Cosméticos funcionando!" });
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/categories', categoryController.list);
router.get('/products', productController.list);
router.get('/products/:id/related', productController.listRelated);

router.get('/users/me', verifyToken, (req, res) => {
    res.json({
        message: "Você está autenticado!",
        userData: req.user
    });
});

router.post('/categories', verifyToken, requireAdmin, categoryController.create);
router.post('/products', verifyToken, requireAdmin, productController.create);

router.get('/cart', verifyToken, cartController.getCart);
router.post('/cart/add', verifyToken, cartController.addItem);
router.delete('/cart/item/:itemId', verifyToken, cartController.removeItem);
router.put('/cart/item/:itemId', verifyToken, cartController.updateItem);

export default router;