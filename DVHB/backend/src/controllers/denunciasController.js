const Denuncia = require('../models/denuncias.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.produto_id) where.produto_id = req.query.produto_id;
        if (req.query.tipo) where.tipo = req.query.tipo;
        if (req.query.status) where.status = req.query.status;

        const denuncias = await Denuncia.findAll({ where });
        res.json(denuncias);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const denuncia = await Denuncia.findByPk(id);

        if (!denuncia) {
            return res.status(404).json({ message: 'Denúncia não encontrada' });
        }

        res.json(denuncia);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const denuncia = await Denuncia.create(req.body);
        res.status(201).json(denuncia);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const denuncia = await Denuncia.findByPk(id);

        if (!denuncia) {
            return res.status(404).json({ message: 'Denúncia não encontrada' });
        }

        await denuncia.update(req.body);
        res.json(denuncia);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const denuncia = await Denuncia.findByPk(id);

        if (!denuncia) {
            return res.status(404).json({ message: 'Denúncia não encontrada' });
        }

        await denuncia.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};