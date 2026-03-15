const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const RespostaAvaliacao = sequelize.define('RespostaAvaliacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    avaliacao_id: { type: DataTypes.INTEGER, allowNull: false },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    resposta: { type: DataTypes.TEXT, allowNull: false },
    curtidas: { type: DataTypes.INTEGER, defaultValue: 0 },
    data_resposta: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'resposta_avaliacao',
    timestamps: false,
});

module.exports = RespostaAvaliacao;