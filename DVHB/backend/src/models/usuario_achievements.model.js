const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioAchievements = sequelize.define('UsuarioAchievements', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    nome_achievement: { type: DataTypes.STRING(100) },
    descricao: { type: DataTypes.STRING(500) },
    icone_achievement: { type: DataTypes.STRING(255) },
    progresso_atual: { type: DataTypes.INTEGER, defaultValue: 0 },
    progresso_total: { type: DataTypes.INTEGER },
    desbloqueado: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_desbloqueio: { type: DataTypes.DATE },
}, {
    tableName: 'usuario_achievements',
    timestamps: false,
});

module.exports = UsuarioAchievements;