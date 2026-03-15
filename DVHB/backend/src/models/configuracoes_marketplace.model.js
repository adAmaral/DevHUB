const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ConfigMarketplace = sequelize.define('ConfigMarketplace', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chave: { type: DataTypes.STRING, allowNull: true },
    valor: { type: DataTypes.TEXT, allowNull: true },
    data_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'configuracoes_marketplace',
    timestamps: false,
});

module.exports = ConfigMarketplace;
