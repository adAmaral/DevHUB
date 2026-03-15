const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const DadosBackupUsuario = sequelize.define('DadosBackupUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_backup: { type: DataTypes.STRING(50) },
    dados_json: { type: DataTypes.TEXT('long') },
    tamanho_bytes: { type: DataTypes.BIGINT },
    formato_arquivo: { type: DataTypes.STRING(20) },
    data_backup: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_expiracao: { type: DataTypes.DATE },
    acessado: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'dados_backup_usuario',
    timestamps: false,
});

module.exports = DadosBackupUsuario;