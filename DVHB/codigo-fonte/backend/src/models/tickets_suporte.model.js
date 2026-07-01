const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TicketSuporte = sequelize.define('TicketSuporte', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'tickets_suporte',
    timestamps: false,
});

module.exports = TicketSuporte;
