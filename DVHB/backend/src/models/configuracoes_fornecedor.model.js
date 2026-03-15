const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ConfigFornecedor = sequelize.define('ConfigFornecedor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    chave_config: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'configuracoes_fornecedor',
    timestamps: false,
});

module.exports = ConfigFornecedor;
