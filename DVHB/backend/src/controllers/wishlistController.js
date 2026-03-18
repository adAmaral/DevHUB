const Wishlist = require('../models/wishlist.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.produto_id) where.produto_id = req.query.produto_id;
        if (req.query.preco_alerta !== undefined) {
            where.preco_alerta = req.query.preco_alerta === 'true';
        }

        const itens = await Wishlist.findAll({ where });
        res.json(itens);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Wishlist.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Item da wishlist não encontrado' });
        }

        res.json(item);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const item = await Wishlist.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Wishlist.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Item da wishlist não encontrado' });
        }

        await item.update(req.body);
        res.json(item);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Wishlist.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Item da wishlist não encontrado' });
        }

        await item.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};