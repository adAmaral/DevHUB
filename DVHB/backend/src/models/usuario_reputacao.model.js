const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioReputacao = sequelize.define('UsuarioReputacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    score_reputacao: { type: DataTypes.INTEGER, defaultValue: 0 },
    nivel_reputacao: { type: DataTypes.STRING(50) },
    avaliacoes_util: { type: DataTypes.INTEGER, defaultValue: 0 },
    avaliacao_favoraveis: { type: DataTypes.INTEGER, defaultValue: 0 },
    avaliacao_negativas: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_ultima_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'usuario_reputacao',
    timestamps: false,
});

module.exports = UsuarioReputacao;