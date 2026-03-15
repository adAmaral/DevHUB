const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasTicketsSuporte = sequelize.define('SaasTicketsSuporte', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(255), allowNull: false },
    prioridade: { type: DataTypes.ENUM('baixa', 'media', 'alta', 'critica'), defaultValue: 'media' },
    status: { type: DataTypes.ENUM('aberto', 'em_andamento', 'resolvido', 'fechado'), defaultValue: 'aberto' },
    categoria: { type: DataTypes.STRING(100) },
    descricao: { type: DataTypes.TEXT },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_resolucao: { type: DataTypes.DATE },
    responsavel_id: { type: DataTypes.INTEGER },
    tempo_resolucao_horas: { type: DataTypes.DECIMAL(10, 2) },
}, {
    tableName: 'saas_tickets_suporte',
    timestamps: false,
});

module.exports = SaasTicketsSuporte;