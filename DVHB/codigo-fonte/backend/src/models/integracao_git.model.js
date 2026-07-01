const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const IntegracaoGit = sequelize.define('IntegracaoGit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_repo: { type: DataTypes.ENUM('github', 'gitlab', 'bitbucket', 'gitea'), allowNull: false },
    url_repositorio: { type: DataTypes.STRING(500), allowNull: true },
    token_acesso: { type: DataTypes.STRING(500), allowNull: true },
    owner_repo: { type: DataTypes.STRING(255), allowNull: true },
    branch_principal: { type: DataTypes.STRING(100), defaultValue: 'main' },
    webhook_url: { type: DataTypes.STRING(500), allowNull: true },
    webhook_secret: { type: DataTypes.STRING(500), allowNull: true },
    webhook_ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    build_automatico: { type: DataTypes.BOOLEAN, defaultValue: true },
    teste_automatico: { type: DataTypes.BOOLEAN, defaultValue: true },
    deploy_automatico: { type: DataTypes.BOOLEAN, defaultValue: false },
    ultima_sincronizacao: { type: DataTypes.DATE, allowNull: true },
    proxima_sincronizacao: { type: DataTypes.DATE, allowNull: true },
    commits_total: { type: DataTypes.INTEGER, defaultValue: 0 },
    contributors: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'integracao_git',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['software_id', 'tipo_repo'] }
    ]
});

module.exports = IntegracaoGit;
