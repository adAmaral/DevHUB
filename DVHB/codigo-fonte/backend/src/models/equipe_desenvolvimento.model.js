const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const EquipeDesenvolvimento = sequelize.define('EquipeDesenvolvimento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    papel: { type: DataTypes.ENUM('owner', 'developer', 'tester', 'manager', 'analyst', 'designer'), defaultValue: 'developer' },
    permissoes: { type: DataTypes.JSON, allowNull: true },
    software_restrito_id: { type: DataTypes.INTEGER, allowNull: true },
    data_adicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'equipe_desenvolvimento',
    timestamps: false,
});

module.exports = EquipeDesenvolvimento;
