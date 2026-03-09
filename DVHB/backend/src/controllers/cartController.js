const Cart = require('../models/cart.model');

exports.getCartItems = async (req, res, next) => {
    try{
        const cart = await Cart.findAll({ where: { usuario_id: req.params.usuario_id } });
        res.json(cart);
    }
    catch (err) {
        next(err);
    }
};

exports.addToCart = async (req, res, next) => {
    try{
        const cartItem = await Cart.create(req.body);
        res.status(201).json(cartItem);
    }
    catch (err) {
        next(err);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try{
        const { id } = req.params;
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item do carrinho não encontrado' });
        }
        await cartItem.update(req.body);
        res.json(cartItem);
    }
    catch (err) {
        next(err);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try{
        const { id } = req.params;
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item do carrinho não encontrado' });
        }
        await cartItem.destroy();
        res.json({ message: 'Item removido do carrinho' });
    }
    catch (err) {
        next(err);
    }
};