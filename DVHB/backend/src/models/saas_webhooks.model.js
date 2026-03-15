const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasWebhooks = sequelize.define('SaasWebhooks', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    url_webhook: { type: DataTypes.STRING(500) },
    eventos_disparadores: { type: DataTypes.JSON },
    headers_customizados: { type: DataTypes.JSON },
    metodo_http: { type: DataTypes.STRING(10), defaultValue: 'POST' },
    timeout_segundos: { type: DataTypes.INTEGER, defaultValue: 30 },
    tentativas_maximas: { type: DataTypes.INTEGER, defaultValue: 3 },
    tentativas_falhadas: { type: DataTypes.INTEGER, defaultValue: 0 },
    ultima_tentativa: { type: DataTypes.DATE },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_webhooks',
    timestamps: false,
});

module.exports = SaasWebhooks;