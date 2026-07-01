const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ConsentimentoPrivacidade = sequelize.define('ConsentimentoPrivacidade', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_dado: { type: DataTypes.ENUM('marketing', 'analiticos', 'cookies', 'compartilhamento'), allowNull: false },
    consentimento: { type: DataTypes.BOOLEAN },
    data_consentimento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ip_consentimento: { type: DataTypes.STRING(50) },
    fonte_consentimento: { type: DataTypes.STRING(100) },
    versao_politica: { type: DataTypes.STRING(10) },
}, {
    tableName: 'consentimento_privacidade',
    timestamps: false,
});

module.exports = ConsentimentoPrivacidade;