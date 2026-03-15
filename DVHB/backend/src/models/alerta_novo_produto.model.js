const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AlertaNovoProduto = sequelize.define('AlertaNovoProduto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    categoria_monitorada: { type: DataTypes.STRING(100) },
    tags_monitoradas: { type: DataTypes.STRING(500) },
    fornecedor_monitorado: { type: DataTypes.INTEGER },
    notificar_email: { type: DataTypes.BOOLEAN, defaultValue: true },
    notificar_push: { type: DataTypes.BOOLEAN, defaultValue: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'alerta_novo_produto',
    timestamps: false,
});

module.exports = AlertaNovoProduto;