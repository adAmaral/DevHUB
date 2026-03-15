const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TicketsAdminMarketplace = sequelize.define('TicketsAdminMarketplace', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    assunto: { type: DataTypes.STRING(255) },
    descricao: { type: DataTypes.TEXT },
    prioridade: { type: DataTypes.ENUM('baixa', 'media', 'alta', 'critica'), defaultValue: 'media' },
    categoria: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.ENUM('aberto', 'em_progresso', 'resolvido', 'fechado'), defaultValue: 'aberto' },
    assignado_para: { type: DataTypes.INTEGER },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_resolucao: { type: DataTypes.DATE },
}, {
    tableName: 'tickets_admin_marketplace',
    timestamps: false,
});

module.exports = TicketsAdminMarketplace;