const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Carrinho = sequelize.define('Carrinho', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    data_adicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    preco_unitario: { type: DataTypes.FLOAT, allowNull: false },
},
    {
        tableName: 'carrinho',
        timestamps: false,
    });
module.exports = Carrinho;