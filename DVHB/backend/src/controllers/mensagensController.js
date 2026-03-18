const Mensagem = require('../models/mensagens.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.pedido_id) where.pedido_id = req.query.pedido_id;
        if (req.query.tipo) where.tipo = req.query.tipo;
        if (req.query.remetente) where.remetente = req.query.remetente;

        const mensagens = await Mensagem.findAll({ where });
        res.json(mensagens);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mensagem = await Mensagem.findByPk(id);

        if (!mensagem) {
            return res.status(404).json({ message: 'Mensagem não encontrada' });
        }

        res.json(mensagem);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const mensagem = await Mensagem.create(req.body);
        res.status(201).json(mensagem);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mensagem = await Mensagem.findByPk(id);

        if (!mensagem) {
            return res.status(404).json({ message: 'Mensagem não encontrada' });
        }

        await mensagem.update(req.body);
        res.json(mensagem);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mensagem = await Mensagem.findByPk(id);

        if (!mensagem) {
            return res.status(404).json({ message: 'Mensagem não encontrada' });
        }

        await mensagem.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};