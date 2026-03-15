const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CampanhasEmail = sequelize.define('CampanhasEmail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    criada_por: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(255), allowNull: false },
    assunto_email: { type: DataTypes.STRING(255) },
    corpo_email: { type: DataTypes.TEXT },
    tipo_campanha: { type: DataTypes.ENUM('promocao', 'newsletter', 'transacional', 'reengajamento', 'onboarding'), defaultValue: 'newsletter' },
    segmento_alvo: { type: DataTypes.STRING(100) },
    data_agendada: { type: DataTypes.DATEONLY },
    data_envio: { type: DataTypes.DATE },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('rascunho', 'agendada', 'enviando', 'enviada', 'cancelada'), defaultValue: 'rascunho' },
    total_destinatarios: { type: DataTypes.INTEGER },
    enviados: { type: DataTypes.INTEGER, defaultValue: 0 },
    abertos: { type: DataTypes.INTEGER, defaultValue: 0 },
    cliques: { type: DataTypes.INTEGER, defaultValue: 0 },
    taxa_entrega: { type: DataTypes.DECIMAL(5, 2) },
    taxa_abertura: { type: DataTypes.DECIMAL(5, 2) },
    taxa_clique: { type: DataTypes.DECIMAL(5, 2) },
}, {
    tableName: 'campanhas_email',
    timestamps: false,
});

module.exports = CampanhasEmail;