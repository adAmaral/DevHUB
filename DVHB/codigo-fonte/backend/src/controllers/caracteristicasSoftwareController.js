const CaracteristicaSoftware = require('../models/caracteristicas_software.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;

        const caracteristicas = await CaracteristicaSoftware.findAll({ where });
        res.json(caracteristicas);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caracteristica = await CaracteristicaSoftware.findByPk(id);

        if (!caracteristica) {
            return res.status(404).json({ message: 'Característica não encontrada' });
        }

        res.json(caracteristica);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const caracteristica = await CaracteristicaSoftware.create(req.body);
        res.status(201).json(caracteristica);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caracteristica = await CaracteristicaSoftware.findByPk(id);

        if (!caracteristica) {
            return res.status(404).json({ message: 'Característica não encontrada' });
        }

        await caracteristica.update(req.body);
        res.json(caracteristica);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caracteristica = await CaracteristicaSoftware.findByPk(id);

        if (!caracteristica) {
            return res.status(404).json({ message: 'Característica não encontrada' });
        }

        await caracteristica.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};