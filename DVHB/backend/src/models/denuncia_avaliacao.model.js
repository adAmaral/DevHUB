const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const DenunciaAvaliacao = sequelize.define('DenunciaAvaliacao', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    avaliacao_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_denuncia: { type: DataTypes.ENUM('falsa', 'inconveniente', 'spam', 'ofensiva'), allowNull: false },
    descricao: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('aberta', 'em_analise', 'resolvida', 'descartada'), defaultValue: 'aberta' },
    moderador_id: { type: DataTypes.INTEGER },
    analise: { type: DataTypes.TEXT },
    data_denuncia: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'denuncia_avaliacao',
    timestamps: false,
});

module.exports = DenunciaAvaliacao;