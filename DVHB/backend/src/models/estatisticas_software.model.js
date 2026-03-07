const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const EstatisticasSoftware = sequelize.define('EstatisticasSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    data_relatorio: { type: DataTypes.DATEONLY, allowNull: false },
    downloads_dia: { type: DataTypes.INTEGER, defaultValue: 0 },
    downloads_total: { type: DataTypes.INTEGER, defaultValue: 0 },
    vendas_dia: { type: DataTypes.INTEGER, defaultValue: 0 },
    vendas_total: { type: DataTypes.INTEGER, defaultValue: 0 },
    receita_dia: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    receita_total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    usuarios_novos_dia: { type: DataTypes.INTEGER, defaultValue: 0 },
    usuarios_ativos_total: { type: DataTypes.INTEGER, defaultValue: 0 },
    usuarios_inativos: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating_medio: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
    taxa_retencao: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    taxa_churn: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    tempo_uso_medio_horas: { type: DataTypes.INTEGER, allowNull: true },
    feature_mais_usadas: { type: DataTypes.JSON, allowNull: true },
    versao_mais_usada: { type: DataTypes.STRING(50), allowNull: true },
    so_mais_usado: { type: DataTypes.STRING(100), allowNull: true },
}, {
    tableName: 'estatisticas_software',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['software_id', 'data_relatorio'] }
    ]
});

module.exports = EstatisticasSoftware;
