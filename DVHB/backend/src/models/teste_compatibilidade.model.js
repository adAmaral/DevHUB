const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TesteCompatibilidade = sequelize.define('TesteCompatibilidade', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    sistema_operacional: { type: DataTypes.STRING(50) },
    versao_testada: { type: DataTypes.STRING(50) },
    status_teste: { type: DataTypes.ENUM('sucesso', 'falha', 'parcial', 'nao_testado'), defaultValue: 'nao_testado' },
    observacoes: { type: DataTypes.TEXT },
    data_teste: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'teste_compatibilidade',
    timestamps: false,
});

module.exports = TesteCompatibilidade;