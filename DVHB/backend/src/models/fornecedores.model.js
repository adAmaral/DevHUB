const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Fornecedor = sequelize.define('Fornecedor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: true },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    site: { type: DataTypes.STRING, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'fornecedores',
    timestamps: false,
});

module.exports = Fornecedor;
