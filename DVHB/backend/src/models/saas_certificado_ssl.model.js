const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasCertificadoSsl = sequelize.define('SaasCertificadoSsl', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    dominio_certificado: { type: DataTypes.STRING(255) },
    tipo_certificado: { type: DataTypes.ENUM('self_signed', 'lets_encrypt', 'comodo', 'custom'), defaultValue: 'lets_encrypt' },
    data_emissao: { type: DataTypes.DATEONLY },
    data_expiracao: { type: DataTypes.DATEONLY },
    issuer: { type: DataTypes.STRING(255) },
    status_certificado: { type: DataTypes.ENUM('valido', 'proximo_expirar', 'expirado'), defaultValue: 'valido' },
    renov_automatica: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_renovacao_proxima: { type: DataTypes.DATEONLY },
}, {
    tableName: 'saas_certificado_ssl',
    timestamps: false,
});

module.exports = SaasCertificadoSsl;