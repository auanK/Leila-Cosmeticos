import * as productService from '../services/productService.js';

export const list = async (req, res) => {
    try {
        const filters = {
            categoryId: req.query.categoryId,
            search: req.query.search
        };

        const products = await productService.getAllProducts(filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const productData = {
            categoryIds: req.body.category_ids,
            additionalImages: req.body.additional_images,

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

export const listRelated = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await productService.getRelatedProducts(id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = {
            categoryIds: req.body.category_ids,
            additionalImages: req.body.additional_images,

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

        const updatedProduct = await productService.updateProduct(id, productData);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};