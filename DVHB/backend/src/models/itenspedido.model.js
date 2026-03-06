const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const itensPedido = sequelize.define('ItensPedido', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedido_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    Preco_unitario: { type: DataTypes.FLOAT, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
},
    {
        tableName: 'itens_pedido',
        timestamps: false,
    });
module.exports = itensPedido;