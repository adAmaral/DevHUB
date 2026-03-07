const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Software = sequelize.define('Software', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    categoria: { type: DataTypes.STRING, allowNull: true },
    versao_atual: { type: DataTypes.STRING, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'softwares',
    timestamps: false,
});

module.exports = Software;
