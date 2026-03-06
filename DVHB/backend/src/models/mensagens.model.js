const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Mensagem = sequelize.define('Mensagem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    pedido_id: { type: DataTypes.INTEGER, allowNull: true },
    tipo: { type: DataTypes.ENUM('usuario_vendedor', 'suporte'), allowNull: false },
    assunto: { type: DataTypes.STRING, allowNull: false },
    mensagem: { type: DataTypes.TEXT, allowNull: false },
    remetente: {  type: DataTypes.STRING, allowNull: false  },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'mensagens',
        timestamps: false,
    });
module.exports = Mensagem;