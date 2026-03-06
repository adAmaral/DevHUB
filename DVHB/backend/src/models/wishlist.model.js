const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Wishlist = sequelize.define('Wishlist', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    alerta_preco: { type: DataTypes.FLOAT, allowNull: true },
    preco_alerta: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'wishlist',
        timestamps: false,
    });
module.exports = Wishlist;