const Enderco = require('../models/endercos.model');
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
   catch (err) {
    next(err);
   }    
};

exports.create = async (req, res, next) => {
    try {
        const item = await Enderco.create(req.body);
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try{
        const { id } = req.params;
        const item = await Enderco.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Endereço não encontrado'});
        }

        await item.update(req.body);
        res.json(item);
    }
    catch (err){
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Enderco.findByPk(id);
        
        if(!item){
            return res.status(404).json({ message: 'Endereço não encontrado'});
        }
        await item.destroy();
        res.status(204).send();
    }
    catch (err){
        next(err);
    }
};