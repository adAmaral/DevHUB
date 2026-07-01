const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioBadges = sequelize.define('UsuarioBadges', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    nome_badge: { type: DataTypes.STRING(100) },
    descricao_badge: { type: DataTypes.TEXT },
    icone_badge: { type: DataTypes.STRING(255) },
    data_obtencao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'usuario_badges',
    timestamps: false,
});

module.exports = UsuarioBadges;