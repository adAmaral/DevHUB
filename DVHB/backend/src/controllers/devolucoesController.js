const Devolucao = require('../models/devolucoes.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.pedido_id) where.pedido_id = req.query.pedido_id;
        if (req.query.status) where.status = req.query.status;

        const devolucoes = await Devolucao.findAll({ where });
        res.json(devolucoes);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const devolucao = await Devolucao.findByPk(id);

        if (!devolucao) {
            return res.status(404).json({ message: 'Devolução não encontrada' });
        }

        res.json(devolucao);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const devolucao = await Devolucao.create(req.body);
        res.status(201).json(devolucao);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const devolucao = await Devolucao.findByPk(id);

        if (!devolucao) {
            return res.status(404).json({ message: 'Devolução não encontrada' });
        }

        await devolucao.update(req.body);
        res.json(devolucao);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const devolucao = await Devolucao.findByPk(id);

        if (!devolucao) {
            return res.status(404).json({ message: 'Devolução não encontrada' });
        }

        await devolucao.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};