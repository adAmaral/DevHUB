const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const FeatureRequests = sequelize.define('FeatureRequests', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    titulo: { type: DataTypes.STRING(255), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    categoria: { type: DataTypes.STRING(100), allowNull: true },
    votos: { type: DataTypes.INTEGER, defaultValue: 1 },
    comentarios: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('novo','considerando','planejado','em_desenvolvimento','completo','rejeitado','duplicado'), defaultValue: 'novo' },
    data_implementacao: { type: DataTypes.DATEONLY, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'feature_requests',
    timestamps: false,
    indexes: [
        { fields: ['status'] },
        { fields: ['votos'] }
    ]
});

module.exports = FeatureRequests;
