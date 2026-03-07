const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const RespostaSuporte = sequelize.define('RespostaSuporte', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticket_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    mensagem: { type: DataTypes.TEXT, allowNull: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'respostas_suporte',
    timestamps: false,
});

module.exports = RespostaSuporte;
