const Pedidos = require('../models/pedidos.model');

exports.getPedidos = async (req, res, next) => {
    try {
        const where = {};
        if (req.query.usuario_id) {
            where.usuario_id = req.query.usuario_id;
        }
        const pedidos = await Pedidos.findAll({ where });
        res.json(pedidos);
    }
    catch (err) {
        next(err);
    }
};

exports.getPedidoById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const pedido = await Pedidos.findByPk(id);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.json(pedido);
       }
    catch (err) {
        next(err);
    }
};

exports.createPedido = async (req, res, next) => {
    try{
        const pedido = await Pedidos.create(req.body);
        res.status(201).json(pedido);
    }   
    catch (err) {
        next(err);
    }
};

exports.updatePedido = async (req, res, next) => {
    try{
        const { id } = req.params;

        const pedido = await Pedidos.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        await pedido.update(req.body);
        res.json(pedido);
    }
    catch (err) {
        next(err);
    }
};

exports.deletePedido = async (req, res, next) => {
    try{
        const { id } = req.params;

        const pedido = await Pedidos.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        await pedido.destroy();
        res.json({ message: 'Pedido deletado' });
    }
    catch (err) {
        next(err);
    }
};