const payMethod = require('../models/paymethod.model');

exports.getPayMethods = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.usuario_id)
             { where.usuario_id = req.query.usuario_id;}    

    const methods = await payMethod.findAll({ where });
    res.json(methods);
    }
catch (err) {
    next(err);
        }
};

exports.getPayMethodById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const method = await payMethod.findByPk(id);
        if (!method) {
            return res.status(404).json({ message: 'Método de pagamento não encontrado' });
        }
        res.json(method);
    }
    catch (err) {
        next(err);
    }
};

exports.createPayMethod = async (req, res, next) => {
    try {
        const method = await payMethod.create(req.body);
        res.status(201).json(method);
    }
    catch (err) {
        next(err);
    }
};

exports.updatePayMethod = async (req, res, next) => {
    try {
        const { id } = req.params;
        const method = await payMethod.findByPk(id);

        if (!method) {
            return res.status(404).json({ message: 'Método de pagamento não encontrado' });
        }

        await method.update(req.body);
        res.json(method);
    }
    catch (err) {
        next(err);
    }
};

exports.deletePayMethod = async (req, res, next) => {
    try {
        const { id } = req.params;
        const method = await payMethod.findByPk(id);

        if (!method) {
            return res.status(404).json({ message: 'Método de pagamento não encontrado' });
        }
        await method.destroy();
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};