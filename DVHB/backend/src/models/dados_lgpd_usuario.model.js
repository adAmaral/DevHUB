const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const DadosLgpdUsuario = sequelize.define('DadosLgpdUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_solicitacao: { type: DataTypes.ENUM('anonimizacao', 'delecao', 'portabilidade'), allowNull: false },
    descricao: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('solicitado', 'processando', 'concluido', 'cancelado'), defaultValue: 'solicitado' },
    data_solicitacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_conclusao: { type: DataTypes.DATEONLY },
    detalhes_processamento: { type: DataTypes.TEXT },
}, {
    tableName: 'dados_lgpd_usuario',
    timestamps: false,
});

module.exports = DadosLgpdUsuario;