import * as productService from '../services/productService.js';

export const list = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const productData = {
            categoryId: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            priceFrom: req.body.price_from,
            priceTo: req.body.price_to,
            currentStock: req.body.current_stock,
            brand: req.body.brand,
            skinType: req.body.skin_type,
            weightGrams: req.body.weight_grams,
            isActive: req.body.is_active,
            mainImage: req.body.main_image
        };

        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};