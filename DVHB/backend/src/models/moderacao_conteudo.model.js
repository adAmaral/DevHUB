const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ModeracaoConteudo = sequelize.define('ModeracaoConteudo', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    avaliacao_id: { type: DataTypes.INTEGER, allowNull: false },
    status_moderacao: { type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada', 'editada'), defaultValue: 'pendente' },
    motivo_rejeicao: { type: DataTypes.STRING(255) },
    moderador_id: { type: DataTypes.INTEGER },
    comentario_moderador: { type: DataTypes.TEXT },
    data_moderacao: { type: DataTypes.DATE },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'moderacao_conteudo',
    timestamps: false,
});

module.exports = ModeracaoConteudo;