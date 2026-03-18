const Fornecedor = require('../models/fornecedores.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.ativo !== undefined) where.ativo = req.query.ativo === 'true';

        const fornecedores = await Fornecedor.findAll({ where });
        res.json(fornecedores);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fornecedor = await Fornecedor.findByPk(id);

        if (!fornecedor) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        res.json(fornecedor);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const fornecedor = await Fornecedor.create(req.body);
        res.status(201).json(fornecedor);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fornecedor = await Fornecedor.findByPk(id);

        if (!fornecedor) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        await fornecedor.update(req.body);
        res.json(fornecedor);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fornecedor = await Fornecedor.findByPk(id);

        if (!fornecedor) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        await fornecedor.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};