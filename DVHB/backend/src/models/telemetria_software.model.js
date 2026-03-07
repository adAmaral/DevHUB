const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TelemetriaSoftware = sequelize.define('TelemetriaSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    licenca_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    evento_tipo: { type: DataTypes.STRING(100), allowNull: true },
    sessao_id: { type: DataTypes.STRING(255), allowNull: true },
    detalhes: { type: DataTypes.JSON, allowNull: true },
    versao_software: { type: DataTypes.STRING(50), allowNull: true },
    build_numero: { type: DataTypes.INTEGER, allowNull: true },
    so_usuario: { type: DataTypes.STRING(50), allowNull: true },
    versao_so: { type: DataTypes.STRING(50), allowNull: true },
    arquitetura: { type: DataTypes.STRING(20), allowNull: true },
    navegador: { type: DataTypes.STRING(100), allowNull: true },
    resolucao_tela: { type: DataTypes.STRING(20), allowNull: true },
    ip_usuario: { type: DataTypes.STRING(50), allowNull: true },
    pais: { type: DataTypes.STRING(100), allowNull: true },
    cidade: { type: DataTypes.STRING(100), allowNull: true },
    locacao_lat: { type: DataTypes.DECIMAL(10,8), allowNull: true },
    locacao_lng: { type: DataTypes.DECIMAL(11,8), allowNull: true },
    duracao_sessao_segundos: { type: DataTypes.INTEGER, allowNull: true },
    paginas_visitadas: { type: DataTypes.INTEGER, allowNull: true },
    tempo_inatividade_segundos: { type: DataTypes.INTEGER, allowNull: true },
    data_evento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'telemetria_software',
    timestamps: false,
    indexes: [
        { fields: ['licenca_id', 'data_evento'] },
        { fields: ['evento_tipo'] },
        { fields: ['sessao_id'] }
    ]
});

module.exports = TelemetriaSoftware;
