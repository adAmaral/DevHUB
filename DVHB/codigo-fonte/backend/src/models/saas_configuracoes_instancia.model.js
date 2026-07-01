const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasConfiguracoesInstancia = sequelize.define('SaasConfiguracoesInstancia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    chave_config: { type: DataTypes.STRING(100) },
    valor_config: { type: DataTypes.TEXT },
    tipo: { type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'file'), defaultValue: 'string' },
    data_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_configuracoes_instancia',
    timestamps: false,
});

module.exports = SaasConfiguracoesInstancia;