const IntegracaoGit = require('../models/integracao_git.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) {
            where.software_id = req.query.software_id;
        }
        if (req.query.tipo_repo) {
            where.tipo_repo = req.query.tipo_repo;
        }
        if (req.query.webhook_ativo !== undefined) {
            where.webhook_ativo = req.query.webhook_ativo === 'true';
        }

        const integracoes = await IntegracaoGit.findAll({ where });
        res.json(integracoes);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const integracao = await IntegracaoGit.findByPk(id);

        if (!integracao) {
            return res.status(404).json({ message: 'Integração Git não encontrada' });
        }

        res.json(integracao);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const integracao = await IntegracaoGit.create(req.body);
        res.status(201).json(integracao);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const integracao = await IntegracaoGit.findByPk(id);

        if (!integracao) {
            return res.status(404).json({ message: 'Integração Git não encontrada' });
        }

        await integracao.update(req.body);
        res.json(integracao);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const integracao = await IntegracaoGit.findByPk(id);

        if (!integracao) {
            return res.status(404).json({ message: 'Integração Git não encontrada' });
        }

        await integracao.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};