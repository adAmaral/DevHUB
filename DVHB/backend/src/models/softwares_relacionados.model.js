const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SoftwaresRelacionados = sequelize.define('SoftwaresRelacionados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_a: { type: DataTypes.INTEGER, allowNull: false },
    software_b: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'softwares_relacionados',
    timestamps: false,
});

module.exports = SoftwaresRelacionados;
