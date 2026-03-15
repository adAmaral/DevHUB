const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const BundlesSoftware = sequelize.define('BundlesSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    criado_por: { type: DataTypes.INTEGER, allowNull: true },
}, {
    tableName: 'bundles_software',
    timestamps: false,
});

module.exports = BundlesSoftware;
