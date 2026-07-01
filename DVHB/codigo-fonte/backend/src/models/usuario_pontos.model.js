const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioPontos = sequelize.define('UsuarioPontos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    pontos_totais: { type: DataTypes.INTEGER, defaultValue: 0 },
    pontos_disponiveis: { type: DataTypes.INTEGER, defaultValue: 0 },
    historico_pontos: { type: DataTypes.JSON },
    data_ultima_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'usuario_pontos',
    timestamps: false,
});

module.exports = UsuarioPontos;