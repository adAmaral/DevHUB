const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasConfiguracao = sequelize.define('SaasConfiguracao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    dominio_principal: { type: DataTypes.STRING, allowNull: true },
    infraestrutura: { type: DataTypes.STRING, allowNull: true },
    provedor_cloud: { type: DataTypes.ENUM('aws','azure','gcp','digitalocean','linode','outro'), defaultValue: 'aws' },
    regiao_padrao: { type: DataTypes.STRING, allowNull: true },
    database_tipo: { type: DataTypes.STRING, allowNull: true },
    cache_tipo: { type: DataTypes.STRING, allowNull: true },
    cdn_habilitado: { type: DataTypes.BOOLEAN, defaultValue: true },
    backup_automatico: { type: DataTypes.BOOLEAN, defaultValue: true },
    frequencia_backup: { type: DataTypes.STRING, defaultValue: 'diaria' },
    support_level: { type: DataTypes.ENUM('community','basic','premium','enterprise'), defaultValue: 'basic' },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_configuracao',
    timestamps: false,
});

module.exports = SaasConfiguracao;
