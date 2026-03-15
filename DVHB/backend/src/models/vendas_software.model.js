const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const VendaSoftware = sequelize.define('VendaSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    comprador_id: { type: DataTypes.INTEGER, allowNull: true },
    valor: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    status_pagamento: { type: DataTypes.STRING, allowNull: true },
    data_venda: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'vendas_software',
    timestamps: false,
});

module.exports = VendaSoftware;
