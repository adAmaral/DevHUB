const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const DocumentacaoApi = sequelize.define('DocumentacaoApi', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    endpoint: { type: DataTypes.STRING(500) },
    metodo_http: { type: DataTypes.STRING(10) },
    descricao_endpoint: { type: DataTypes.TEXT },
    parametros: { type: DataTypes.JSON },
    exemplo_requisicao: { type: DataTypes.TEXT },
    exemplo_resposta: { type: DataTypes.TEXT },
    codigo_resposta: { type: DataTypes.INTEGER },
    rate_limit: { type: DataTypes.INTEGER },
    versao_api: { type: DataTypes.STRING(50) },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'documentacao_api',
    timestamps: false,
});

module.exports = DocumentacaoApi;