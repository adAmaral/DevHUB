const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TaxasFornecedorCustomizado = sequelize.define('TaxasFornecedorCustomizado', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    categoria_software: { type: DataTypes.STRING(100) },
    taxa_comissao: { type: DataTypes.DECIMAL(5, 2) },
    taxa_minima: { type: DataTypes.DECIMAL(10, 2) },
    motivo_customizacao: { type: DataTypes.STRING(255) },
    data_inicio: { type: DataTypes.DATEONLY },
    data_fim: { type: DataTypes.DATEONLY },
    aprovado_admin: { type: DataTypes.INTEGER },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'taxas_fornecedor_customizado',
    timestamps: false,
});

module.exports = TaxasFornecedorCustomizado;