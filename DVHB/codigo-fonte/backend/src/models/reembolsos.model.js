const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Reembolsos = sequelize.define('Reembolsos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    venda_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: false },
    descricao: { type: DataTypes.TEXT },
    valor_reembolso: { type: DataTypes.DECIMAL(10, 2) },
    metodo_reembolso: { type: DataTypes.STRING(50) },
    status: { type: DataTypes.ENUM('solicitado', 'aprovado', 'processando', 'concluido', 'rejeitado'), defaultValue: 'solicitado' },
    data_solicitacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_processamento: { type: DataTypes.DATEONLY },
    data_conclusao: { type: DataTypes.DATEONLY },
    comprovante_transacao: { type: DataTypes.STRING(255) },
}, {
    tableName: 'reembolsos',
    timestamps: false,
});

module.exports = Reembolsos;