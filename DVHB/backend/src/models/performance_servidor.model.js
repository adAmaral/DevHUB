const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PerformanceServidor = sequelize.define('PerformanceServidor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cpu_percentual: { type: DataTypes.DECIMAL(5, 2) },
    memoria_usada_gb: { type: DataTypes.DECIMAL(5, 2) },
    memoria_total_gb: { type: DataTypes.DECIMAL(5, 2) },
    disco_usado_gb: { type: DataTypes.DECIMAL(10, 2) },
    disco_total_gb: { type: DataTypes.DECIMAL(10, 2) },
    latencia_media_ms: { type: DataTypes.INTEGER },
    requisicoes_por_segundo: { type: DataTypes.INTEGER },
    taxa_erro: { type: DataTypes.INTEGER, defaultValue: 0 },
    status_servico: { type: DataTypes.ENUM('ok', 'degradado', 'offline'), defaultValue: 'ok' },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'performance_servidor',
    timestamps: false,
});

module.exports = PerformanceServidor;