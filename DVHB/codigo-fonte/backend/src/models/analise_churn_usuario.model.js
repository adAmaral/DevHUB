const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AnaliseChurnUsuario = sequelize.define('AnaliseChurnUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    dias_inatividade: { type: DataTypes.INTEGER },
    ultima_atividade_data: { type: DataTypes.DATEONLY },
    risco_churn: { type: DataTypes.ENUM('baixo', 'medio', 'alto', 'critico'), defaultValue: 'baixo' },
    valor_vida_usuario: { type: DataTypes.DECIMAL(12, 2) },
    motivo_suspeito_churn: { type: DataTypes.STRING(255) },
    data_analise: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'analise_churn_usuario',
    timestamps: false,
});

module.exports = AnaliseChurnUsuario;