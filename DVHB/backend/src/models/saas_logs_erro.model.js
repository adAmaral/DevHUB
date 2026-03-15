const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasLogsErro = sequelize.define('SaasLogsErro', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_erro: { type: DataTypes.STRING(100) },
    mensagem_erro: { type: DataTypes.TEXT },
    stack_trace: { type: DataTypes.TEXT },
    url_requisicao: { type: DataTypes.STRING(500) },
    usuario_afetado: { type: DataTypes.INTEGER },
    severidade: { type: DataTypes.ENUM('info', 'warning', 'error', 'critical'), defaultValue: 'error' },
    resolvido: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_erro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_logs_erro',
    timestamps: false,
});

module.exports = SaasLogsErro;