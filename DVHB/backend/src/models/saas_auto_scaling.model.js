const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasAutoScaling = sequelize.define('SaasAutoScaling', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    auto_scaling_habilitado: { type: DataTypes.BOOLEAN, defaultValue: false },
    cpu_min_percentual: { type: DataTypes.INTEGER, defaultValue: 30 },
    cpu_max_percentual: { type: DataTypes.INTEGER, defaultValue: 80 },
    memoria_min_percentual: { type: DataTypes.INTEGER, defaultValue: 30 },
    memoria_max_percentual: { type: DataTypes.INTEGER, defaultValue: 80 },
    instâncias_minimas: { type: DataTypes.INTEGER, defaultValue: 1 },
    instâncias_maximas: { type: DataTypes.INTEGER, defaultValue: 5 },
    tempo_escala_minutos: { type: DataTypes.INTEGER, defaultValue: 5 },
    data_config: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_auto_scaling',
    timestamps: false,
});

module.exports = SaasAutoScaling;