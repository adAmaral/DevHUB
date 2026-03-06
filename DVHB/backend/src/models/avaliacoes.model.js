const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Avaliacoes = sequelize.define('Avaliacoes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedido_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: true },
    fotos: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'avaliacoes',
        timestamps: false,
    });
module.exports = Avaliacoes;