const Webhooks = require('../models/webhooks.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};
        
        if (req.query.fornecedor_id) {where.fornecedor_id = req.query.fornecedor_id;}

        if (req.query.ativo !== undefined) { where.ativo = req.query.ativo === 'true'; }

        const webhooks = await Webhooks.findAll({ where });
        res.json(webhooks);
        }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const webhook = await Webhooks.findByPk(id);

        if (!webhook) {
            return res.status(404).json({ message: 'Webhook não encontrado' });
        }

        res.json(webhook);
        }
    catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const webhook = await Webhooks.create(req.body);
        res.status(201).json(webhook);
        }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const webhook = await Webhooks.findByPk(id);

        if (!webhook) { return res.status(404).json({ message: 'Webhook não encontrado' }); }

        await webhook.update(req.body);
        res.json(webhook);
        }
    catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const webhook = await Webhooks.findByPk(id);

        if (!webhook) { return res.status(404).json({ message: 'Webhook não encontrado' }); }

        await webhook.destroy();
        res.status(204).send();
        }
    catch (err) {
        next(err);
    }
};