const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const BoletosEmitidos = sequelize.define('BoletosEmitidos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    numero_boleto: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    valor_boleto: { type: DataTypes.DECIMAL(12, 2) },
    data_vencimento: { type: DataTypes.DATEONLY },
    data_emissao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    banco_emissor: { type: DataTypes.STRING(50) },
    url_boleto: { type: DataTypes.STRING(500) },
    status: { type: DataTypes.ENUM('emitido', 'lido', 'pago', 'vencido', 'cancelado'), defaultValue: 'emitido' },
    data_pagamento: { type: DataTypes.DATEONLY },
}, {
    tableName: 'boletos_emitidos',
    timestamps: false,
});

module.exports = BoletosEmitidos;