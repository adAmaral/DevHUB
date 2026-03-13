const Avaliacoes = require('../models/avaliacoes.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.produto_id) where.produto_id = req.query.produto_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.pedido_id) where.pedido_id = req.query.pedido_id;

        const avaliacoes = await Avaliacoes.findAll({ where });
        res.json(avaliacoes);
        }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const avaliacao = await Avaliacoes.findByPk(id);

        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        res.json(avaliacao);
        }
    catch (err) {
        next(err);
        }
};

exports.create = async (req, res, next) => {
    try {
        const avaliacao = await Avaliacoes.create(req.body);
        res.status(201).json(avaliacao);
        }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const avaliacao = await Avaliacoes.findByPk(id);

        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        await avaliacao.update(req.body);
        res.json(avaliacao);
        }
    catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const avaliacao = await Avaliacoes.findByPk(id);

        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        await avaliacao.destroy();
        res.status(204).send();
        }
    catch (err) {
        next(err);
    }
};