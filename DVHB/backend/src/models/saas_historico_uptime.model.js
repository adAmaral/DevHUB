const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasHistoricoUptime = sequelize.define('SaasHistoricoUptime', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    data_relatorio: { type: DataTypes.DATE, allowNull: true },
    percentual_uptime: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    tempo_downtime_minutos: { type: DataTypes.INTEGER, allowNull: true },
    incidentes_count: { type: DataTypes.INTEGER, allowNull: true },
    alertas_count: { type: DataTypes.INTEGER, allowNull: true },
    performance_score: { type: DataTypes.DECIMAL(3,2), allowNull: true },
}, {
    tableName: 'saas_historico_uptime',
    timestamps: false,
});

module.exports = SaasHistoricoUptime;
