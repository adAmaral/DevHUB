const Favoritos = require('../models/favoritos.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.produto_id) where.produto_id = req.query.produto_id;

        const favoritos = await Favoritos.findAll({ where });
        res.json(favoritos);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const favorito = await Favoritos.findByPk(id);

        if (!favorito) {
            return res.status(404).json({ message: 'Favorito não encontrado' });
        }

        res.json(favorito);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const favorito = await Favoritos.create(req.body);
        res.status(201).json(favorito);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const favorito = await Favoritos.findByPk(id);

        if (!favorito) {
            return res.status(404).json({ message: 'Favorito não encontrado' });
        }

        await favorito.update(req.body);
        res.json(favorito);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const favorito = await Favoritos.findByPk(id);

        if (!favorito) {
            return res.status(404).json({ message: 'Favorito não encontrado' });
        }

        await favorito.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};