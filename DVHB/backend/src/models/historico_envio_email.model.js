const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const HistoricoEnvioEmail = sequelize.define('HistoricoEnvioEmail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER },
    email_destinatario: { type: DataTypes.STRING(255) },
    campanha_id: { type: DataTypes.INTEGER },
    assunto: { type: DataTypes.STRING(255) },
    tipo_email: { type: DataTypes.STRING(50) },
    status_envio: { type: DataTypes.ENUM('enviado', 'falha', 'bounce', 'spam'), defaultValue: 'enviado' },
    motivo_falha: { type: DataTypes.STRING(255) },
    data_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_abertura: { type: DataTypes.DATE },
    links_clicados: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    tableName: 'historico_envio_email',
    timestamps: false,
});

module.exports = HistoricoEnvioEmail;