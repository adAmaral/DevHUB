const Product = require('../models/product.model');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    }
    catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
            }catch (err) {
        next(err);
        }
};

exports.createProduct = async (req, res, next) => {
    try{
        const product = await Product.create(req.body);
        res.status(201).json(product);
        }catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try{
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        await product.update(req.body);
        res.json(product);
    }
        catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try{
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
    }
    catch (err) {
        next(err);
        }
};