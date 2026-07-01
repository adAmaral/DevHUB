const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PlanoCaracteristica = sequelize.define('PlanoCaracteristica', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    plano_id: { type: DataTypes.INTEGER, allowNull: false },
    caracteristica_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'plano_caracteristicas',
    timestamps: false,
});

module.exports = PlanoCaracteristica;
