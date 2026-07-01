const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasLogsAcesso = sequelize.define('SaasLogsAcesso', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER },
    email_usuario: { type: DataTypes.STRING(255) },
    ip_acesso: { type: DataTypes.STRING(50) },
    user_agent: { type: DataTypes.STRING(500) },
    tipo_acesso: { type: DataTypes.ENUM('login', 'logout', 'api_call', 'webhook', 'integracao'), defaultValue: 'login' },
    endpoint_acessado: { type: DataTypes.STRING(500) },
    metodo: { type: DataTypes.STRING(10) },
    codigo_resposta: { type: DataTypes.INTEGER },
    tempo_requisicao_ms: { type: DataTypes.INTEGER },
    bytes_enviados: { type: DataTypes.INTEGER },
    bytes_recebidos: { type: DataTypes.INTEGER },
    data_acesso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_logs_acesso',
    timestamps: false,
});

module.exports = SaasLogsAcesso;