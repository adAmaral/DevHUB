const Cupon = require('../models/cupons.model');

exports.getCupon = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.usuario_id) {
            where.usuario_id = req.query.usuario_id;
        }
        const cupons = await Cupon.findAll({ where });
        res.json(cupons);
    }
    catch (err) {
        next(err);
    }
};

exports.createCupon = async (req, res, next) => {
    try {
        const cupon = await Cupon.create(req.body);
        res.status(201).json(cupon);
    }
    catch (err) {
        next(err);
    }
};