const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ArtigosConhecimento = sequelize.define('ArtigosConhecimento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titulo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    descricao: { type: DataTypes.TEXT },
    conteudo: { type: DataTypes.TEXT },
    categoria: { type: DataTypes.STRING(100) },
    tags: { type: DataTypes.STRING(500) },
    autor_id: { type: DataTypes.INTEGER },
    visualizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
    util: { type: DataTypes.INTEGER, defaultValue: 0 },
    nao_util: { type: DataTypes.INTEGER, defaultValue: 0 },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_publicacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'artigos_conhecimento',
    timestamps: false,
});

module.exports = ArtigosConhecimento;