const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasBrandingInstancia = sequelize.define('SaasBrandingInstancia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    logo_url: { type: DataTypes.STRING(500) },
    logo_favicon: { type: DataTypes.STRING(500) },
    cor_primaria: { type: DataTypes.STRING(7) },
    cor_secundaria: { type: DataTypes.STRING(7) },
    font_primaria: { type: DataTypes.STRING(100) },
    footer_customizado: { type: DataTypes.TEXT },
    header_customizado: { type: DataTypes.TEXT },
    css_custom: { type: DataTypes.TEXT },
    nome_brandizado: { type: DataTypes.STRING(255) },
    email_suporte_customizado: { type: DataTypes.STRING(255) },
    telefone_suporte: { type: DataTypes.STRING(15) },
    data_atualizacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_branding_instancia',
    timestamps: false,
});

module.exports = SaasBrandingInstancia;