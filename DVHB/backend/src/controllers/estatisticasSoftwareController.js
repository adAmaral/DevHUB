const EstatisticasSoftware = require('../models/estatisticas_software.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.data_relatorio) where.data_relatorio = req.query.data_relatorio;

        const stats = await EstatisticasSoftware.findAll({ where });
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stat = await EstatisticasSoftware.findByPk(id);

        if (!stat) {
            return res.status(404).json({ message: 'Estatística de software não encontrada' });
        }

        res.json(stat);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const stat = await EstatisticasSoftware.create(req.body);
        res.status(201).json(stat);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stat = await EstatisticasSoftware.findByPk(id);

        if (!stat) {
            return res.status(404).json({ message: 'Estatística de software não encontrada' });
        }

        await stat.update(req.body);
        res.json(stat);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stat = await EstatisticasSoftware.findByPk(id);

        if (!stat) {
            return res.status(404).json({ message: 'Estatística de software não encontrada' });
        }

        await stat.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};