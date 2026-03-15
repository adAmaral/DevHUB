const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const FaqSoftware = sequelize.define('FaqSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    pergunta: { type: DataTypes.STRING(500), allowNull: false },
    resposta: { type: DataTypes.TEXT, allowNull: false },
    categoria_faq: { type: DataTypes.STRING(100) },
    visualizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
    util: { type: DataTypes.INTEGER, defaultValue: 0 },
    nao_util: { type: DataTypes.INTEGER, defaultValue: 0 },
    ordem: { type: DataTypes.INTEGER },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'faq_software',
    timestamps: false,
});

module.exports = FaqSoftware;