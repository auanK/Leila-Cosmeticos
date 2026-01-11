import express from 'express';
import * as authController from './controllers/authController.js';
import * as categoryController from './controllers/categoryController.js';
import * as productController from './controllers/productController.js';
import * as cartController from './controllers/cartController.js';
import * as addressController from './controllers/addressController.js';
import * as checkoutController from './controllers/checkoutController.js';
import * as orderController from './controllers/orderController.js';
import * as wishlistController from './controllers/wishlistController.js';
import * as userController from './controllers/userController.js';
import * as reviewController from './controllers/reviewController.js';

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

router.get('/users/me', verifyToken, userController.getMe);
router.put('/users/me', verifyToken, userController.update);
router.get('/admin/clients', verifyToken, requireAdmin, userController.listClients);

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
router.get('/admin/orders', verifyToken, requireAdmin, orderController.listAll);

router.get('/wishlist', verifyToken, wishlistController.list);
router.post('/wishlist', verifyToken, wishlistController.add);
router.delete('/wishlist/:productId', verifyToken, wishlistController.remove);

router.get('/reviews/me', verifyToken, reviewController.listUserReviews);
router.get('/reviews/me/products', verifyToken, reviewController.getReviewedProducts);
router.get('/products/:productId/reviews', reviewController.list);
router.post('/products/:productId/reviews', verifyToken, reviewController.create);

export default router;