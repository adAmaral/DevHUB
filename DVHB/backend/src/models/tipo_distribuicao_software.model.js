const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TipoDistribuicaoSoftware = sequelize.define('TipoDistribuicaoSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_distribuicao: { type: DataTypes.ENUM('download', 'saas', 'cloud', 'api', 'plugin', 'extensao', 'hibrido'), allowNull: false },
    descricao: { type: DataTypes.STRING(500) },
    url_acesso: { type: DataTypes.STRING(500) },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'tipo_distribuicao_software',
    timestamps: false,
});

module.exports = TipoDistribuicaoSoftware;