const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const RequisitoSoftware = sequelize.define('RequisitoSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: true },
    descricao: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'requisitos_software',
    timestamps: false,
});

module.exports = RequisitoSoftware;
