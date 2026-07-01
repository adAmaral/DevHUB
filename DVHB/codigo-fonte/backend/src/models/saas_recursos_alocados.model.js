const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasRecursosAlocados = sequelize.define('SaasRecursosAlocados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    cpu_cores: { type: DataTypes.DECIMAL(3, 1) },
    memoria_ram_gb: { type: DataTypes.INTEGER },
    storage_disco_gb: { type: DataTypes.INTEGER },
    bandwidth_limitado_gb: { type: DataTypes.INTEGER },
    conexoes_db_simultaneas: { type: DataTypes.INTEGER },
    conexoes_cache_simultaneas: { type: DataTypes.INTEGER },
    tipo_instancia: { type: DataTypes.STRING(100) },
    hardware_dedicado: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_alocacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_recursos_alocados',
    timestamps: false,
});

module.exports = SaasRecursosAlocados;