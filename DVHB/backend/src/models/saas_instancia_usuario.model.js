const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasInstanciaUsuario = sequelize.define('SaasInstanciaUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    licenca_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    url_acesso: { type: DataTypes.STRING, allowNull: true },
    subdomain: { type: DataTypes.STRING, allowNull: true },
    dominio_customizado: { type: DataTypes.STRING, allowNull: true },
    status_instancia: { type: DataTypes.ENUM('criando','ativa','pausada','suspensa','deletada'), defaultValue: 'criando' },
    tipo_ambiente: { type: DataTypes.ENUM('producao','staging','desenvolvimento'), defaultValue: 'producao' },
    versao_software: { type: DataTypes.STRING, allowNull: true },
    regiao_servidor: { type: DataTypes.STRING, allowNull: true },
    ip_servidor: { type: DataTypes.STRING, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_ativacao: { type: DataTypes.DATE, allowNull: true },
    data_delecao: { type: DataTypes.DATE, allowNull: true },
}, {
    tableName: 'saas_instancia_usuario',
    timestamps: false,
});

module.exports = SaasInstanciaUsuario;
