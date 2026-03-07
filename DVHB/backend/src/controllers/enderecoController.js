const Enderco = require('../models/Endereco');
exports.getAll = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        const items = await Enderco.findAll({ where });
        res.json(items);
    }
    catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Enderco.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }
        res.json(item);
    }
    res.json(item);
}   catch (err) {
    next(err);
};