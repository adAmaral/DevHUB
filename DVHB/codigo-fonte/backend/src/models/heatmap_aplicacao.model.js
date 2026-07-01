const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const HeatmapAplicacao = sequelize.define('HeatmapAplicacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    sessao_id: { type: DataTypes.STRING(255) },
    pagina_url: { type: DataTypes.STRING(500) },
    posicao_x: { type: DataTypes.INTEGER },
    posicao_y: { type: DataTypes.INTEGER },
    tipo_evento: { type: DataTypes.ENUM('click', 'scroll', 'hover', 'keystroke'), defaultValue: 'click' },
    elemento_html: { type: DataTypes.STRING(255) },
    duracao_segundos: { type: DataTypes.INTEGER },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'heatmap_aplicacao',
    timestamps: false,
});

module.exports = HeatmapAplicacao;