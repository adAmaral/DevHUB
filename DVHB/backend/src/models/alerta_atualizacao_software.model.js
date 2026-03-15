const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AlertaAtualizacaoSoftware = sequelize.define('AlertaAtualizacaoSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    notificar_todas_atualizacoes: { type: DataTypes.BOOLEAN, defaultValue: true },
    notificar_security_patch: { type: DataTypes.BOOLEAN, defaultValue: true },
    notificar_feature_major: { type: DataTypes.BOOLEAN, defaultValue: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'alerta_atualizacao_software',
    timestamps: false,
});

module.exports = AlertaAtualizacaoSoftware;