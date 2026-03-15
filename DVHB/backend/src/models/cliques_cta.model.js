const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CliquesCta = sequelize.define('CliquesCta', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER },
    tipo_cta: { type: DataTypes.STRING(100) },
    posicao_cta: { type: DataTypes.STRING(100) },
    origem_pagina: { type: DataTypes.STRING(500) },
    data_clique: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'cliques_cta',
    timestamps: false,
});

module.exports = CliquesCta;