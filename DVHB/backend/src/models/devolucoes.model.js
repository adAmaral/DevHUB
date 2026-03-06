const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Devolucao = sequelize.define('Devolucao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedido_id: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada', 'reembolsada'), defaultValue: 'pendente' },
    numero_etiqueta: { type: DataTypes.STRING, allowNull: true },
    data_solicitacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_resolucao: { type: DataTypes.DATE, allowNull: true },
},
    {
        tableName: 'devolucoes',
        timestamps: false,
    });
module.exports = Devolucao;