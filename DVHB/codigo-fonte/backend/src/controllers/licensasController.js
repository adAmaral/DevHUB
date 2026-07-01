const Licenca = require('../models/licencas.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) {
            where.software_id = req.query.software_id;
        }
        if (req.query.tipo) {
            where.tipo = req.query.tipo;
        }
        if (req.query.ativo !== undefined) {
            where.ativo = req.query.ativo === 'true';
        }

        const licencas = await Licenca.findAll({ where });
        res.json(licencas);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const licenca = await Licenca.findByPk(id);

        if (!licenca) {
            return res.status(404).json({ message: 'Licença não encontrada' });
        }

        res.json(licenca);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const licenca = await Licenca.create(req.body);
        res.status(201).json(licenca);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const licenca = await Licenca.findByPk(id);

        if (!licenca) {
            return res.status(404).json({ message: 'Licença não encontrada' });
        }

        await licenca.update(req.body);
        res.json(licenca);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const licenca = await Licenca.findByPk(id);

        if (!licenca) {
            return res.status(404).json({ message: 'Licença não encontrada' });
        }

        await licenca.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};