const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Autenticacao2fa = sequelize.define('Autenticacao2fa', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_2fa: { type: DataTypes.ENUM('totp', 'email', 'sms'), allowNull: false },
    secret_totp: { type: DataTypes.STRING(255) },
    telefone_sms: { type: DataTypes.STRING(15) },
    backup_codes: { type: DataTypes.JSON },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_ativacao: { type: DataTypes.DATE },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'autenticacao_2fa',
    timestamps: false,
});

module.exports = Autenticacao2fa;