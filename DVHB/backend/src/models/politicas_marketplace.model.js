const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PoliticasMarketplace = sequelize.define('PoliticasMarketplace', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo_politica: { type: DataTypes.ENUM('termos_servico', 'privacidade', 'cookies', 'devolucao', 'intelectual'), allowNull: false },
    titulo: { type: DataTypes.STRING(255) },
    conteudo: { type: DataTypes.TEXT },
    versao: { type: DataTypes.STRING(10) },
    data_vigencia: { type: DataTypes.DATEONLY },
    data_proxima_atualizacao: { type: DataTypes.DATEONLY },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'politicas_marketplace',
    timestamps: false,
});

module.exports = PoliticasMarketplace;