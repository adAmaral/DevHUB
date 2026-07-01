const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasIntegracaoInstancia = sequelize.define('SaasIntegracaoInstancia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    software_integrado_id: { type: DataTypes.INTEGER },
    nome_integracao: { type: DataTypes.STRING(255) },
    tipo_integracao: { type: DataTypes.ENUM('webhook', 'api', 'plugin', 'extensao', 'custom'), defaultValue: 'api' },
    status_integracao: { type: DataTypes.ENUM('ativa', 'inativa', 'erro'), defaultValue: 'ativa' },
    chave_api_integracao: { type: DataTypes.STRING(255) },
    secret_integracao: { type: DataTypes.STRING(255) },
    configuracoes: { type: DataTypes.JSON },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ultima_sincronia: { type: DataTypes.DATE },
    proxima_sincronia: { type: DataTypes.DATE },
}, {
    tableName: 'saas_integracao_instancia',
    timestamps: false,
});

module.exports = SaasIntegracaoInstancia;