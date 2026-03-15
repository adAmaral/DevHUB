const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasMetricasTempoReal = sequelize.define('SaasMetricasTempoReal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    timestamp_metrica: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    cpu_percentual: { type: DataTypes.DECIMAL(5, 2) },
    memoria_percentual: { type: DataTypes.DECIMAL(5, 2) },
    disco_percentual: { type: DataTypes.DECIMAL(5, 2) },
    latencia_ms: { type: DataTypes.INTEGER },
    requisicoes_por_segundo: { type: DataTypes.INTEGER },
    usuarios_conectados: { type: DataTypes.INTEGER },
    taxas_erro: { type: DataTypes.DECIMAL(5, 2) },
}, {
    tableName: 'saas_metricas_tempo_real',
    timestamps: false,
});

module.exports = SaasMetricasTempoReal;