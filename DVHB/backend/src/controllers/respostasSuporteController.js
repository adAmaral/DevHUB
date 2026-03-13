const RespostaSuporte = require('../models/resposta_suporte.model');

exports.getAll = async (req, res, next) => {

    try {
        const where = {};

        if (req.query.ticket_id) where.ticket_id = req.query.ticket_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;

        const respostas = await RespostaSuporte.findAll({ where });
        res.json(respostas);
    }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resposta = await RespostaSuporte.findByPk(id);

        if (!resposta) {
            return res.status(404).json({ message: 'Resposta de suporte não encontrada' });
        }
        res.json(resposta);
    }
    catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const resposta = await RespostaSuporte.create(req.body);
        res.status(201).json(resposta);
        }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resposta = await RespostaSuporte.findByPk(id);

        if (!resposta) {
            return res.status(404).json({ message: 'Resposta de suporte não encontrada' });
        }

        await resposta.update(req.body);
        res.json(resposta);
        }
    catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resposta = await RespostaSuporte.findByPk(id);

        if (!resposta) {
        return res.status(404).json({ message: 'Resposta de suporte não encontrada' });
        }
        await resposta.destroy();
        res.status(204).send();
        }
    catch (err) {
        next(err);
    }
};
