const Pedidos = require('../models/pedidos.model');
const Cart = require('../models/cart.model');
const Cupon = require('../models/cupons.model');
const PayMethod = require('../models/paymethod.model');
const itensPedido = require('../models/itenspedido.model');
const sequelize = require('../utils/db');

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
    const t = await sequelize.transaction();
    try{
        const {usuario_id, endereco_entrega_id, metodo_pagamento, cupom_id,} = req.body;

        if (!usuario_id || !endereco_entrega_id || !metodo_pagamento) {
            await t.rollback();
            return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }  

    const cartItems = await Cart.findAll({
    where: { usuario_id },
    transaction: t, });
    
    if (!cartItems.length) {
        await t.rollback();
        return res.status(400).json({ message: 'Carrinho vazio' });
    }

    let subtotal = 0;
    for (const item of cartItems) {
        subtotal += item.preco_unitario * item.quantidade;
    }

    let desconto = 0;
    let total = subtotal;
    let cupomAplicado = null;

    const metodo = await PayMethod.findByPk(metodo_pagamento, { transaction: t });

    if (!metodo || metodo.usuario_id !== usuario_id) {
        await t.rollback();
        return res.status(400).json({ message: 'Método de pagamento inválido' });
    }

    if (cupom_id) {
        cupomAplicado = await Cupon.findByPk(cupom_id, { transaction: t });

        if (!cupomAplicado || cupomAplicado.Ativo || (cupomAplicado.minimo_compra && subtotal < cupomAplicado.minimo_compra)) {
            await t.rollback();
            return res.status(400).json({ message: 'Cupom inválido ou não aplicável' });
        }
    
    if (cupomAplicado.tipo === 'percentual') {
        desconto = subtotal * (cupomAplicado.valor / 100);
    } else if (cupomAplicado.tipo === 'valor_fixo') {
        desconto = cupomAplicado.valor;
    }

    total = subtotal - desconto;

    await cupomAplicado.update({ quantidade_usada: (cupomAplicado.quantidade_usada || 0) + 1 }, { transaction: t });

    const pedido = await Pedidos.create({
        usuario_id,
        endereco_entrega_id,
        metodo_pagamento,
        cupom_id: cupomAplicado ? cupomAplicado.id : null,
        status: 'Pendente',
        subtotal,
        desconto,
        total,
    }, { transaction: t });
    }

    await Cart.destroy({ where: { usuario_id }, transaction: t });
    await t.commit();
    res.status(201).json(pedido);
    }
    catch (err) {
        await t.rollback();
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