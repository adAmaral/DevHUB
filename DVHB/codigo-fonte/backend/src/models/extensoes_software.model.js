const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ExtensoesSoftware = sequelize.define('ExtensoesSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_host_id: { type: DataTypes.INTEGER, allowNull: false },
    software_extensao_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'extensoes_software',
    timestamps: false,
});

module.exports = ExtensoesSoftware;
