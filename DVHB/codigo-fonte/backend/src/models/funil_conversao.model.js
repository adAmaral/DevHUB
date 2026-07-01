const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const FunilConversao = sequelize.define('FunilConversao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    data_relatorio: { type: DataTypes.DATEONLY },
    etapa_funil: { type: DataTypes.STRING(100) },
    quantidade_usuarios: { type: DataTypes.INTEGER },
    quantidade_convertidos: { type: DataTypes.INTEGER },
    taxa_conversao: { type: DataTypes.DECIMAL(5, 2) },
    software_id: { type: DataTypes.INTEGER },
    categoria_software: { type: DataTypes.STRING(100) },
}, {
    tableName: 'funil_conversao',
    timestamps: false,
});

module.exports = FunilConversao;