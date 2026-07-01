const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SessoesUsuario = sequelize.define('SessoesUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    token_sessao: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    ip_address: { type: DataTypes.STRING(50) },
    user_agent: { type: DataTypes.STRING(500) },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_expiracao: { type: DataTypes.DATE },
    ultima_atividade: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'sessoes_usuario',
    timestamps: false,
});

module.exports = SessoesUsuario;