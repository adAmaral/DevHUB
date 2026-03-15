const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasAlertasSaude = sequelize.define('SaasAlertasSaude', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_alerta: { type: DataTypes.ENUM('high_cpu', 'high_memory', 'low_storage', 'downtime', 'error_rate', 'slow_response'), allowNull: false },
    severity: { type: DataTypes.ENUM('info', 'warning', 'critical'), defaultValue: 'warning' },
    descricao: { type: DataTypes.TEXT },
    valor_atual: { type: DataTypes.DECIMAL(10, 2) },
    valor_limite: { type: DataTypes.DECIMAL(10, 2) },
    status_alerta: { type: DataTypes.ENUM('ativo', 'resolvido', 'ignorado'), defaultValue: 'ativo' },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_resolucao: { type: DataTypes.DATE },
}, {
    tableName: 'saas_alertas_saude',
    timestamps: false,
});

module.exports = SaasAlertasSaude;