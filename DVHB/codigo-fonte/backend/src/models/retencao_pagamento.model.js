const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const RetencaoPagamento = sequelize.define('RetencaoPagamento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    valor_retido: { type: DataTypes.DECIMAL(12, 2) },
    motivo_retencao: { type: DataTypes.STRING(255) },
    descricao: { type: DataTypes.TEXT },
    data_retencao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_liberacao: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('retido', 'liberado_parcial', 'liberado_total', 'cancelado'), defaultValue: 'retido' },
}, {
    tableName: 'retencao_pagamento',
    timestamps: false,
});

module.exports = RetencaoPagamento;