const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Pedidos = sequelize.define('Pedidos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    endereco_entrega_id: { type: DataTypes.INTEGER, allowNull: false },
    metodo_pagamento_id: { type: DataTypes.INTEGER, allowNull: false },
    cumpom_id: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado'), defaultValue: 'pendente' },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    desconto: { type: DataTypes.FLOAT, allowNull: true },
    total: { type: DataTypes.FLOAT, allowNull: false },
    data_entrega_prevista: { type: DataTypes.DATE, allowNull: true },
    data_entrega_real: { type: DataTypes.DATE, allowNull: true },
    data_cancelamento: { type: DataTypes.DATE, allowNull: true },
    },
    {
        tableName: 'pedidos',
        timestamps: false,
    });
module.exports = Pedidos; 