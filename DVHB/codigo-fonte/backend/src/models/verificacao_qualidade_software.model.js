const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const VerificacaoQualidadeSoftware = sequelize.define('VerificacaoQualidadeSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    score_qualidade: { type: DataTypes.DECIMAL(3, 2) },
    documentacao_score: { type: DataTypes.DECIMAL(3, 2) },
    seguranca_score: { type: DataTypes.DECIMAL(3, 2) },
    performance_score: { type: DataTypes.DECIMAL(3, 2) },
    compatibilidade_score: { type: DataTypes.DECIMAL(3, 2) },
    suporte_score: { type: DataTypes.DECIMAL(3, 2) },
    recomendacoes: { type: DataTypes.TEXT },
    revisado_por: { type: DataTypes.INTEGER },
    data_analise: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'verificacao_qualidade_software',
    timestamps: false,
});

module.exports = VerificacaoQualidadeSoftware;