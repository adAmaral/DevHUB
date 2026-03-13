const PlanosPreco = require('../models/planos_preco.model');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.ativo !== undefined){
            where.ativo = req.query.ativo === 'true';
        }

        const planos = await PlanosPreco.findAll({ where });
        res.json(planos);
    }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const plano = await PlanosPreco.findByPk(id);

        if (!plano) {
            return res.status(404).json({ message: 'Plano de preço não encontrado' });
        }
        res.json(plano);
    }
    catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const plano = await PlanosPreco.create(req.body);
        res.status(201).json(plano);
    }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const plano = await PlanosPreco.findByPk(id);

        if (!plano) {
        return res.status(404).json({message: 'Plano de Preço não encontrado'});
        }
        await plano.update(req.body);
        res.json(plano);
        }
        catch (err){
            next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.parms;
        const plano = await PlanoPreco.findByPk(id);

        if (!plano){
            return res.status(404).json({message: 'Plano de preço não encontrado'})
        }
        await plano.destroy();
        res.status(204).send();
        }
        catch (err){
            next(err);
    }
};