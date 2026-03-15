const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasRestauracaoBackup = sequelize.define('SaasRestauracaoBackup', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    backup_id: { type: DataTypes.INTEGER, allowNull: false },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    solicitado_por: { type: DataTypes.INTEGER, allowNull: true },
    motivo_restauracao: { type: DataTypes.STRING, allowNull: true },
    data_solicitacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_inicio_restauracao: { type: DataTypes.DATE, allowNull: true },
    data_conclusao: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM('solicitado','em_progresso','concluido','falha'), defaultValue: 'solicitado' },
    detalhes_falha: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'saas_restauracao_backup',
    timestamps: false,
});

module.exports = SaasRestauracaoBackup;
