const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const GuiasInstalacao = sequelize.define('GuiasInstalacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    sistema_operacional: { type: DataTypes.STRING(50) },
    versao_so: { type: DataTypes.STRING(50) },
    passo_a_passo: { type: DataTypes.TEXT },
    requisitos: { type: DataTypes.TEXT },
    solucao_problemas: { type: DataTypes.TEXT },
    screenshots: { type: DataTypes.JSON },
    tempo_instalacao_minutos: { type: DataTypes.INTEGER },
    dificuldade: { type: DataTypes.ENUM('facil', 'media', 'dificil'), defaultValue: 'media' },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'guias_instalacao',
    timestamps: false,
});

module.exports = GuiasInstalacao;