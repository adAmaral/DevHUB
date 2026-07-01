const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const PayMethod = sequelize.define('metodos_pagamento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('cartao_credito', 'cartao_debito', 'boleto', 'pix'), allowNull: false },
    titular: { type: DataTypes.STRING, allowNull: true },
    numero_mascado: { type: DataTypes.STRING, allowNull: true },
    mes_validade: { type: DataTypes.INTEGER, allowNull: true },
    ano_validade: { type: DataTypes.INTEGER, allowNull: true },
    chave_pix: { type: DataTypes.STRING, allowNull: true },
    padrao: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
},
    {
        tableName: 'metodos_pagamento',
        timestamps: false,
    });
module.exports = PayMethod;