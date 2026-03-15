const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const NotificacoesPush = sequelize.define('NotificacoesPush', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(255) },
    mensagem: { type: DataTypes.TEXT },
    icone: { type: DataTypes.STRING(255) },
    url_acao: { type: DataTypes.STRING(500) },
    tipo_notificacao: { type: DataTypes.STRING(50) },
    lida: { type: DataTypes.BOOLEAN, defaultValue: false },
    clicada: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_leitura: { type: DataTypes.DATE },
}, {
    tableName: 'notificacoes_push',
    timestamps: false,
});

module.exports = NotificacoesPush;