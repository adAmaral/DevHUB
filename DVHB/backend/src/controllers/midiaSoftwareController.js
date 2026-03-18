const MidiaSoftware = require('../models/midia_software.model');
exports.getAll = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.software_id) {
            where.software_id = req.query.software_id;
        }
        if (req.query.tipo_midia) {
            where.tipo_midia = req.query.tipo_midia;
        }
        const midias = await MidiaSoftware.findAll({ where });
        res.json(midias);
    } catch (err) {
        next(err);
    }
};
exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const midia = await MidiaSoftware.findByPk(id);
        if (!midia) {
            return res.status(404).json({ message: 'Mídia não encontrada' });
        }
        res.json(midia);
    } catch (err) {
        next(err);
    }
};
exports.create = async (req, res, next) => {
    try {
        const midia = await MidiaSoftware.create(req.body);
        res.status(201).json(midia);
    } catch (err) {
        next(err);
    }
};
exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const midia = await MidiaSoftware.findByPk(id);
        if (!midia) {
            return res.status(404).json({ message: 'Mídia não encontrada' });
        }
        await midia.update(req.body);
        res.json(midia);
    } catch (err) {
        next(err);
    }
};
exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const midia = await MidiaSoftware.findByPk(id);
        if (!midia) {
            return res.status(404).json({ message: 'Mídia não encontrada' });
        }
        await midia.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};