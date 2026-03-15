const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasConsumoUsuario = sequelize.define('SaasConsumoUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    mes_referencia: { type: DataTypes.DATE, allowNull: true },
    storage_usado_gb: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    bandwidth_usado_gb: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    usuarios_ativos: { type: DataTypes.INTEGER, allowNull: true },
    chamdas_api_mes: { type: DataTypes.INTEGER, allowNull: true },
    requisicoes_webhook: { type: DataTypes.INTEGER, allowNull: true },
    integrações_ativas: { type: DataTypes.INTEGER, allowNull: true },
    tempo_uptime_percentual: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    excesso_identificado: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_calculo: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_consumo_usuario',
    timestamps: false,
});

module.exports = SaasConsumoUsuario;
