const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ChavesApi = sequelize.define('ChavesApi', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    chave_publica: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    chave_privada: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    nome_chave: { type: DataTypes.STRING(100) },
    escopo: { type: DataTypes.JSON },
    limite_requisicoes_dia: { type: DataTypes.INTEGER },
    requisicoes_hoje: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_reset_contador: { type: DataTypes.DATEONLY },
    ativa: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ultima_utilizacao: { type: DataTypes.DATE },
}, {
    tableName: 'chaves_api',
    timestamps: false,
});

module.exports = ChavesApi;