const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AnaliseAbandonoCarrinho = sequelize.define('AnaliseAbandonoCarrinho', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    carrinho_id: { type: DataTypes.INTEGER, allowNull: false },
    valor_total: { type: DataTypes.DECIMAL(10, 2) },
    quantidade_itens: { type: DataTypes.INTEGER },
    motivo_abandono: { type: DataTypes.STRING(255) },
    tempo_carrinho_minutos: { type: DataTypes.INTEGER },
    recuperado: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_abandono: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'analise_abandono_carrinho',
    timestamps: false,
});

module.exports = AnaliseAbandonoCarrinho;