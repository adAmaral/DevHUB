const Notificacoes = require('../models/notificacoes.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.lido !== undefined) where.lido = req.query.lido === 'true';
        if (req.query.tipo) where.tipo = req.query.tipo;

        const notificacoes = await Notificacoes.findAll({ where });
        res.json(notificacoes);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notificacao = await Notificacoes.findByPk(id);

        if (!notificacao) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }

        res.json(notificacao);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const notificacao = await Notificacoes.create(req.body);
        res.status(201).json(notificacao);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notificacao = await Notificacoes.findByPk(id);

        if (!notificacao) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }

        await notificacao.update(req.body);
        res.json(notificacao);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notificacao = await Notificacoes.findByPk(id);

        if (!notificacao) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }

        await notificacao.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};