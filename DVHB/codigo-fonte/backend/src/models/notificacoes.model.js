const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Notificacoes = sequelize.define('Notificacoes', {
    
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        usuario_id: { type: DataTypes.INTEGER, allowNull: false },
        titulo: { type: DataTypes.STRING, allowNull: false },
        mensagem: { type: DataTypes.TEXT, allowNull: false },
        tipo: { type: DataTypes.ENUM('promoção', 'pedido', 'sistema', 'oferta'), allowNull: false },
        lido: { type: DataTypes.BOOLEAN, defaultValue: false },
        data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: 'notificacoes',
        timestamps: false,
    });
module.exports = Notificacoes;