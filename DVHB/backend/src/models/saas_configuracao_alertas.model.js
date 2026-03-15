const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasConfiguracaoAlertas = sequelize.define('SaasConfiguracaoAlertas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    notificar_email: { type: DataTypes.BOOLEAN, defaultValue: true },
    notificar_sms: { type: DataTypes.BOOLEAN, defaultValue: false },
    notificar_slack: { type: DataTypes.BOOLEAN, defaultValue: false },
    notificar_pagerduty: { type: DataTypes.BOOLEAN, defaultValue: false },
    threshold_cpu: { type: DataTypes.INTEGER, defaultValue: 80 },
    threshold_memoria: { type: DataTypes.INTEGER, defaultValue: 80 },
    threshold_disco: { type: DataTypes.INTEGER, defaultValue: 90 },
    threshold_latencia_ms: { type: DataTypes.INTEGER, defaultValue: 1000 },
    threshold_taxa_erro: { type: DataTypes.DECIMAL(5, 2), defaultValue: 5.00 },
}, {
    tableName: 'saas_configuracao_alertas',
    timestamps: false,
});

module.exports = SaasConfiguracaoAlertas;