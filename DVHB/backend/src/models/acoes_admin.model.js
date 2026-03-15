const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AcoesAdmin = sequelize.define('AcoesAdmin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_acao: { type: DataTypes.STRING(100), allowNull: false },
    alvo_acao: { type: DataTypes.STRING(255) },
    descricao: { type: DataTypes.TEXT },
    dados_anterior: { type: DataTypes.JSON },
    dados_novo: { type: DataTypes.JSON },
    resultado: { type: DataTypes.ENUM('sucesso', 'falha'), defaultValue: 'sucesso' },
    motivo_falha: { type: DataTypes.STRING(255) },
    data_acao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'acoes_admin',
    timestamps: false,
});

module.exports = AcoesAdmin;