const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AnaliseBusca = sequelize.define('AnaliseBusca', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    termo_busca: { type: DataTypes.STRING(255) },
    quantidade_buscas: { type: DataTypes.INTEGER, defaultValue: 1 },
    quantidade_resultados: { type: DataTypes.INTEGER },
    resultados_clicados: { type: DataTypes.INTEGER, defaultValue: 0 },
    taxa_conversao_post_busca: { type: DataTypes.DECIMAL(5, 2) },
    categoria_maior_relevancia: { type: DataTypes.STRING(100) },
    data_ultima_busca: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'analise_busca',
    timestamps: false,
});

module.exports = AnaliseBusca;