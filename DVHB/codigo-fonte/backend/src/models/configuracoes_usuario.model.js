const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ConfigUsuario = sequelize.define('ConfigUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    chave: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'configuracoes_usuario',
    timestamps: false,
});

module.exports = ConfigUsuario;
