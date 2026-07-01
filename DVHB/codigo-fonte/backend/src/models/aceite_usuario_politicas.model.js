const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AceiteUsuarioPoliticas = sequelize.define('AceiteUsuarioPoliticas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    politica_id: { type: DataTypes.INTEGER, allowNull: false },
    versao_aceita: { type: DataTypes.STRING(10) },
    data_aceite: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ip_aceite: { type: DataTypes.STRING(50) },
}, {
    tableName: 'aceite_usuario_politicas',
    timestamps: false,
});

module.exports = AceiteUsuarioPoliticas;