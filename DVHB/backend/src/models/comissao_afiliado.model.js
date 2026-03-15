const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ComissaoAfiliado = sequelize.define('ComissaoAfiliado', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    afiliado_id: { type: DataTypes.INTEGER, allowNull: false },
    venda_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER },
    valor_venda: { type: DataTypes.DECIMAL(10, 2) },
    percentual_comissao: { type: DataTypes.DECIMAL(5, 2) },
    valor_comissao: { type: DataTypes.DECIMAL(10, 2) },
    status_comissao: { type: DataTypes.ENUM('pendente', 'processando', 'paga', 'retida'), defaultValue: 'pendente' },
    data_venda: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_pagamento: { type: DataTypes.DATEONLY },
}, {
    tableName: 'comissao_afiliado',
    timestamps: false,
});

module.exports = ComissaoAfiliado;