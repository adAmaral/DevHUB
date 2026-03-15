const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const HistoricoAlertaPreco = sequelize.define('HistoricoAlertaPreco', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    alerta_id: { type: DataTypes.INTEGER, allowNull: false },
    preco_anterior: { type: DataTypes.DECIMAL(10, 2) },
    preco_novo: { type: DataTypes.DECIMAL(10, 2) },
    data_alteracao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    usuario_notificado: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'historico_alerta_preco',
    timestamps: false,
});

module.exports = HistoricoAlertaPreco;