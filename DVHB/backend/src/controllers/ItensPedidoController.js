const ItensPedido = require('../models/itenspedido.model');

exports.getItensPedidoByPedidoId = async (req, res, next) => {
    try {
        const itens = await ItensPedido.findAll({ where: { pedido_id: req.params.pedido_id } });
        res.json(itens);
    }
    catch (err) {
        next(err);
    }
};

exports.createItemPedido = async (req, res, next) => {
    try {
        const item = await ItensPedido.create(req.body);
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
};