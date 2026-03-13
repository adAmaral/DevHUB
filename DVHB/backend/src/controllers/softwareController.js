const Software = require('../models/software.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;
        if (req.query.categoria) where.categoria = req.query.categoria;
        if (req.query.ativo !== undefined){
            where.ativo = req.query.ativo === 'true';
        }

        const softwares = await Software.findAll({ where });
        res.json(softwares);
    }
    catch (err) {
        next(err);
        }
    };

    exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const software = await Software.findByPk(id);

        if (!software) {
            return res.status(404).json({ message: 'Software não encontrado' });
        }
        res.json(software);
    }
    catch (err) {
        next(err);
        }
    };

    exports.create = async (req, res, next) => {
    try {
        const software = await Software.create(req.body);
        res.status(201).json(software);
        }
    catch (err) {
        next(err);
        }
    };

    exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const software = await Software.findByPk(id);

        if (!software) {
            return res.status(404).json({ message: 'Software não encontrado' });
        }

        await software.update(req.body);
        res.json(software);
    }
    catch (err) {
        next(err);
        }
    };

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const software = await Software.findByPk(id);

        if (!software) {
        return res.status(404).json({ message: 'Software não encontrado' });
        }
    await software.destroy();
    res.status(204).send();
    }
    catch (err) {
        next(err);
        }
};

