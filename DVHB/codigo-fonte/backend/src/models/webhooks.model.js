const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Webhook = sequelize.define('Webhook', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    url_webhook: { type: DataTypes.STRING(500), allowNull: false },
    eventos: { type: DataTypes.JSON, allowNull: true },
    headers_customizados: { type: DataTypes.JSON, allowNull: true },
    metodo_http: { type: DataTypes.STRING(10), defaultValue: 'POST' },
    timeout_segundos: { type: DataTypes.INTEGER, defaultValue: 30 },
    tentativas_maximas: { type: DataTypes.INTEGER, defaultValue: 5 },
    tentativas_falhas: { type: DataTypes.INTEGER, defaultValue: 0 },
    ultima_tentativa: { type: DataTypes.DATE, allowNull: true },
    proxima_tentativa: { type: DataTypes.DATE, allowNull: true },
    status_ultimo_envio: { type: DataTypes.STRING(3), allowNull: true },
    resposta_ultimo_envio: { type: DataTypes.TEXT, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'webhooks',
    timestamps: false,
});

module.exports = Webhook;
