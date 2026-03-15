const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const LogsSeguranca = sequelize.define('LogsSeguranca', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER },
    tipo_evento: { type: DataTypes.ENUM('login', 'logout', 'mudanca_senha', 'mudanca_email', 'falha_login', 'acesso_negado', 'dados_exportados', 'dados_deletados'), allowNull: false },
    descricao: { type: DataTypes.TEXT },
    ip_address: { type: DataTypes.STRING(50) },
    user_agent: { type: DataTypes.STRING(500) },
    resultado: { type: DataTypes.ENUM('sucesso', 'falha', 'alert'), defaultValue: 'sucesso' },
    data_evento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'logs_seguranca',
    timestamps: false,
});

module.exports = LogsSeguranca;