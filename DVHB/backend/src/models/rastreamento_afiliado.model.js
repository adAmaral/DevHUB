const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const RastreamentoAfiliado = sequelize.define('RastreamentoAfiliado', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    afiliado_id: { type: DataTypes.INTEGER, allowNull: false },
    link_afiliado: { type: DataTypes.STRING(500) },
    software_id: { type: DataTypes.INTEGER },
    cliques: { type: DataTypes.INTEGER, defaultValue: 0 },
    conversoes: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ultima_clique: { type: DataTypes.DATE },
}, {
    tableName: 'rastreamento_afiliado',
    timestamps: false,
});

module.exports = RastreamentoAfiliado;