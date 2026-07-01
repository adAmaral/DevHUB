const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasLimitesPlano = sequelize.define('SaasLimitesPlano', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    plano_id: { type: DataTypes.INTEGER, allowNull: false },
    limite_usuarios: { type: DataTypes.INTEGER },
    limite_storage_gb: { type: DataTypes.INTEGER },
    limite_bandwidth_gb: { type: DataTypes.INTEGER },
    limite_api_chamadas_dia: { type: DataTypes.INTEGER },
    limite_usuarios_simultaneos: { type: DataTypes.INTEGER },
    limite_projetos: { type: DataTypes.INTEGER },
    limite_integrações: { type: DataTypes.INTEGER },
    limite_webhooks: { type: DataTypes.INTEGER },
    limite_agendamentos: { type: DataTypes.INTEGER },
    limite_execucoes_mes: { type: DataTypes.INTEGER },
    suporte_prioridade: { type: DataTypes.ENUM('email', 'chat', 'phone', 'dedicado'), defaultValue: 'email' },
    tempo_resposta_horas: { type: DataTypes.INTEGER },
    sso_permitido: { type: DataTypes.BOOLEAN, defaultValue: false },
    whitelabel_permitido: { type: DataTypes.BOOLEAN, defaultValue: false },
    custom_domain_permitido: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'saas_limites_plano',
    timestamps: false,
});

module.exports = SaasLimitesPlano;