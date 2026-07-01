const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const EmailsAgendados = sequelize.define('EmailsAgendados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    destinatario_email: { type: DataTypes.STRING(255) },
    assunto: { type: DataTypes.STRING(255) },
    corpo: { type: DataTypes.TEXT },
    tipo_email: { type: DataTypes.STRING(50) },
    data_agendada: { type: DataTypes.DATE },
    data_envio: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('agendado', 'enviado', 'falha', 'cancelado'), defaultValue: 'agendado' },
    tentativas: { type: DataTypes.INTEGER, defaultValue: 0 },
    proxima_tentativa: { type: DataTypes.DATE },
}, {
    tableName: 'emails_agendados',
    timestamps: false,
});

module.exports = EmailsAgendados;