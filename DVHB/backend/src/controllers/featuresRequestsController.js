const FeatureRequests = require('../models/feature_requests.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.status) where.status = req.query.status;
        if (req.query.categoria) where.categoria = req.query.categoria;

        const features = await FeatureRequests.findAll({ where });
        res.json(features);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feature = await FeatureRequests.findByPk(id);

        if (!feature) {
            return res.status(404).json({ message: 'Feature request não encontrada' });
        }

        res.json(feature);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const feature = await FeatureRequests.create(req.body);
        res.status(201).json(feature);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feature = await FeatureRequests.findByPk(id);

        if (!feature) {
            return res.status(404).json({ message: 'Feature request não encontrada' });
        }

        await feature.update(req.body);
        res.json(feature);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feature = await FeatureRequests.findByPk(id);

        if (!feature) {
            return res.status(404).json({ message: 'Feature request não encontrada' });
        }

        await feature.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};