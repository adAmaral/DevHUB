const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasWebhookChamadas = sequelize.define('SaasWebhookChamadas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    webhook_id: { type: DataTypes.INTEGER, allowNull: false },
    dados_enviados: { type: DataTypes.JSON },
    resposta_recebida: { type: DataTypes.JSON },
    codigo_resposta: { type: DataTypes.INTEGER },
    tempo_resposta_ms: { type: DataTypes.INTEGER },
    status_chamada: { type: DataTypes.ENUM('sucesso', 'falha', 'timeout'), defaultValue: 'sucesso' },
    tentativa_numero: { type: DataTypes.INTEGER },
    data_chamada: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_webhook_chamadas',
    timestamps: false,
});

module.exports = SaasWebhookChamadas;