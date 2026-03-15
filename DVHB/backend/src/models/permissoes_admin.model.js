const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PermissoesAdmin = sequelize.define('PermissoesAdmin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    permissao: { type: DataTypes.STRING(100), allowNull: false },
    recurso_alvo: { type: DataTypes.STRING(100) },
    data_concessao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'permissoes_admin',
    timestamps: false,
});

module.exports = PermissoesAdmin;