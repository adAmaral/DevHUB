const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasAcessosInstancia = sequelize.define('SaasAcessosInstancia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_acesso: { type: DataTypes.ENUM('admin','usuario','desenvolvedor','suporte','leitura'), defaultValue: 'admin' },
    username: { type: DataTypes.STRING, allowNull: true },
    email_acesso: { type: DataTypes.STRING, allowNull: true },
    senha_hash: { type: DataTypes.STRING, allowNull: true },
    senha_temporaria: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao_acesso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_ultima_login: { type: DataTypes.DATE, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    permissoes: { type: DataTypes.JSON, allowNull: true },
}, {
    tableName: 'saas_acessos_instancia',
    timestamps: false,
});

module.exports = SaasAcessosInstancia;
