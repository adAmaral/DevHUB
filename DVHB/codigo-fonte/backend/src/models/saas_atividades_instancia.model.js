const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasAtividadesInstancia = sequelize.define('SaasAtividadesInstancia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instancia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_atividade: { type: DataTypes.STRING(100) },
    descricao: { type: DataTypes.TEXT },
    usuario_id: { type: DataTypes.INTEGER },
    dados_atividade: { type: DataTypes.JSON },
    resultado: { type: DataTypes.ENUM('sucesso', 'falha', 'pendente'), defaultValue: 'sucesso' },
    data_atividade: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'saas_atividades_instancia',
    timestamps: false,
});

module.exports = SaasAtividadesInstancia;