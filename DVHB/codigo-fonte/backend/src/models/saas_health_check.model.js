const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasHealthCheck = sequelize.define('SaasHealthCheck', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    endpoint_verificacao: { type: DataTypes.STRING, allowNull: true },
    status_resposta: { type: DataTypes.STRING, allowNull: true },
    tempo_resposta_ms: { type: DataTypes.INTEGER, allowNull: true },
    codigo_http: { type: DataTypes.INTEGER, allowNull: true },
    disponibilidade: { type: DataTypes.BOOLEAN, allowNull: true },
    detalhes_erro: { type: DataTypes.TEXT, allowNull: true },
    data_verificacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_health_check',
    timestamps: false,
});

module.exports = SaasHealthCheck;
