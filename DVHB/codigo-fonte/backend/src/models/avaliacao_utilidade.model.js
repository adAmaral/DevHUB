const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AvaliacaoUtilidade = sequelize.define('AvaliacaoUtilidade', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    avaliacao_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    utilidade: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
    tableName: 'avaliacao_utilidade',
    timestamps: false,
});

module.exports = AvaliacaoUtilidade;
