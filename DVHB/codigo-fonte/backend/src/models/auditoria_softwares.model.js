const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AuditoriaSoftware = sequelize.define('AuditoriaSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    software_id: { type: DataTypes.INTEGER, allowNull: true },
    tabela_alvo: { type: DataTypes.STRING(100), allowNull: true },
    tipo_acao: { type: DataTypes.ENUM('insert', 'update', 'delete', 'login', 'export', 'publicacao', 'cancela'), defaultValue: 'update' },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    dados_anterior: { type: DataTypes.JSON, allowNull: true },
    dados_novo: { type: DataTypes.JSON, allowNull: true },
    endereco_ip: { type: DataTypes.STRING(50), allowNull: true },
    user_agent: { type: DataTypes.STRING(500), allowNull: true },
    data_acao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'auditoria_softwares',
    timestamps: false,
    indexes: [
        { fields: ['fornecedor_id', 'data_acao'], name: 'idx_fornecedor_data' },
        { fields: ['tipo_acao'], name: 'idx_tipo_acao' }
    ]
});

module.exports = AuditoriaSoftware;
