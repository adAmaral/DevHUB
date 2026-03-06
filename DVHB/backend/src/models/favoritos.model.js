const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Favoritos = sequelize.define('Favoritos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    data_adicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'favoritos',
        timestamps: false,
    });
module.exports = Favoritos;