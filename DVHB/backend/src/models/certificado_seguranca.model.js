const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CertificadoSeguranca = sequelize.define('CertificadoSeguranca', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_certificado: { type: DataTypes.STRING(100) },
    numero_certificado: { type: DataTypes.STRING(255) },
    data_emissao: { type: DataTypes.DATE },
    data_expiracao: { type: DataTypes.DATE },
    autoridade_certificadora: { type: DataTypes.STRING(255) },
    certificado_arquivo: { type: DataTypes.STRING(500) },
}, {
    tableName: 'certificado_seguranca',
    timestamps: false,
});

module.exports = CertificadoSeguranca;