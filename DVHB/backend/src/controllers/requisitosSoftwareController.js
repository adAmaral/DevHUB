const RequisitosSoftware = require('../models/requisitos_software.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.tipo) where.tipo = req.query.tipo;

        const requisitos = await RequisitosSoftware.findAll({ where });
        res.json(requisitos);
    }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requisito = await RequisitosSoftware.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ message: 'Requisito de software não encontrado' });
        }
        res.json(requisito);
    }
    catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const requisito = await RequisitosSoftware.create(req.body);
        res.status(201).json(requisito);
    }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requisito = await RequisitosSoftware.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ message: 'Requisito de software não encontrado' });
        }
        await requisito.update(req.body);
        res.json(requisito);
    }
    catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requisito = await RequisitosSoftware.findByPk(id);

        if (!requisito) {
            return res.status(404).json({ message: 'Requisito de software não encontrado' });
        }
        await requisito.destroy();
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};