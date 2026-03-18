const AuditoriaSoftware = require('../models/auditoria_softwares.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.tabela_alvo) where.tabela_alvo = req.query.tabela_alvo;
        if (req.query.tipo_acao) where.tipo_acao = req.query.tipo_acao;

        const logs = await AuditoriaSoftware.findAll({ where });
        res.json(logs);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await AuditoriaSoftware.findByPk(id);

        if (!log) {
            return res.status(404).json({ message: 'Registro de auditoria não encontrado' });
        }

        res.json(log);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const log = await AuditoriaSoftware.create(req.body);
        res.status(201).json(log);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await AuditoriaSoftware.findByPk(id);

        if (!log) {
            return res.status(404).json({ message: 'Registro de auditoria não encontrado' });
        }

        await log.update(req.body);
        res.json(log);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await AuditoriaSoftware.findByPk(id);

        if (!log) {
            return res.status(404).json({ message: 'Registro de auditoria não encontrado' });
        }

        await log.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};