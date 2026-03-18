const EquipeDesenvolvimento = require('../models/equipe_desenvolvimento.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.papel) where.papel = req.query.papel;
        if (req.query.software_restrito_id) where.software_restrito_id = req.query.software_restrito_id;
        if (req.query.ativo !== undefined) where.ativo = req.query.ativo === 'true';

        const membros = await EquipeDesenvolvimento.findAll({ where });
        res.json(membros);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const membro = await EquipeDesenvolvimento.findByPk(id);

        if (!membro) {
            return res.status(404).json({ message: 'Membro da equipe não encontrado' });
        }

        res.json(membro);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const membro = await EquipeDesenvolvimento.create(req.body);
        res.status(201).json(membro);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const membro = await EquipeDesenvolvimento.findByPk(id);

        if (!membro) {
            return res.status(404).json({ message: 'Membro da equipe não encontrado' });
        }

        await membro.update(req.body);
        res.json(membro);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const membro = await EquipeDesenvolvimento.findByPk(id);

        if (!membro) {
            return res.status(404).json({ message: 'Membro da equipe não encontrado' });
        }

        await membro.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};