const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ConfigNotificacao = sequelize.define('ConfigNotificacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_notificacao: { type: DataTypes.STRING, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'configuracoes_notificacao',
    timestamps: false,
});

module.exports = ConfigNotificacao;
