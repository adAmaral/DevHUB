const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioNivel = sequelize.define('UsuarioNivel', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    nivel_atual: { type: DataTypes.INTEGER, defaultValue: 1 },
    experiencia_atual: { type: DataTypes.INTEGER, defaultValue: 0 },
    experiencia_para_proximo_nivel: { type: DataTypes.INTEGER },
    beneficios_nivel: { type: DataTypes.JSON },
    data_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'usuario_nivel',
    timestamps: false,
});

module.exports = UsuarioNivel;