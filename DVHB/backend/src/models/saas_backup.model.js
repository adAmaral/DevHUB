const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasBackup = sequelize.define('SaasBackup', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_backup: { type: DataTypes.ENUM('incremental','completo','diferencial'), defaultValue: 'incremental' },
    tamanho_backup_gb: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    local_armazenamento: { type: DataTypes.STRING, allowNull: true },
    data_backup: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_proxima_restauracao: { type: DataTypes.DATE, allowNull: true },
    status_backup: { type: DataTypes.ENUM('sucesso','em_progresso','falha'), defaultValue: 'em_progresso' },
    tempo_restauracao_minutos: { type: DataTypes.INTEGER, allowNull: true },
    checagem_integridade: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'saas_backup',
    timestamps: false,
});

module.exports = SaasBackup;
