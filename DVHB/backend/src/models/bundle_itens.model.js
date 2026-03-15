const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const BundleItens = sequelize.define('BundleItens', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bundle_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'bundle_itens',
    timestamps: false,
});

module.exports = BundleItens;
