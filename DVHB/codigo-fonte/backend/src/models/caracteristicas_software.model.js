const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CaracteristicaSoftware = sequelize.define('CaracteristicaSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'caracteristicas_software',
    timestamps: false,
});

module.exports = CaracteristicaSoftware;
