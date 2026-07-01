const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioAdmin = sequelize.define('UsuarioAdmin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    nivel_acesso: { type: DataTypes.ENUM('super_admin', 'admin_conteudo', 'admin_financeiro', 'admin_suporte', 'moderador'), allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_promocao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'usuario_admin',
    timestamps: false,
});

module.exports = UsuarioAdmin;