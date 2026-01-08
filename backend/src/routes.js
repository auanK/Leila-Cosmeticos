import express from 'express';
import * as authController from './controllers/authController.js';
import * as categoryController from './controllers/categoryController.js';
import * as productController from './controllers/productController.js';
import * as cartController from './controllers/cartController.js';
import * as addressController from './controllers/addressController.js';
import * as checkoutController from './controllers/checkoutController.js';
import * as orderController from './controllers/orderController.js';

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

router.get('/addresses', verifyToken, addressController.list);
router.post('/addresses', verifyToken, addressController.create);
router.put('/addresses/:id', verifyToken, addressController.update);
router.delete('/addresses/:id', verifyToken, addressController.remove);

router.post('/checkout', verifyToken, checkoutController.checkout);

router.get('/orders', verifyToken, orderController.list);

export default router;