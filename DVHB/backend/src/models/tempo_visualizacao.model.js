const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TempoVisualizacao = sequelize.define('TempoVisualizacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    sessao_id: { type: DataTypes.STRING(255) },
    tempo_segundos: { type: DataTypes.INTEGER },
    data_visualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'tempo_visualizacao',
    timestamps: false,
});

module.exports = TempoVisualizacao;