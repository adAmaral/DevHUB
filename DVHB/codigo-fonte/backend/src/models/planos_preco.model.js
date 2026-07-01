const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PlanoPreco = sequelize.define('PlanoPreco', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    preco_mensal: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    preco_anual: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    criado_por: { type: DataTypes.INTEGER, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'planos_preco',
    timestamps: false,
});

module.exports = PlanoPreco;
