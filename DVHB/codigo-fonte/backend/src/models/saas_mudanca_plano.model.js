const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SaasMudancaPlano = sequelize.define('SaasMudancaPlano', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    licenca_id: { type: DataTypes.INTEGER, allowNull: false },
    plano_anterior_id: { type: DataTypes.INTEGER },
    plano_novo_id: { type: DataTypes.INTEGER },
    data_mudanca: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_efetivacao: { type: DataTypes.DATEONLY },
    motivo_mudanca: { type: DataTypes.STRING(255) },
    prec_ajuste: { type: DataTypes.DECIMAL(10, 2) },
    tipo_mudanca: { type: DataTypes.ENUM('upgrade', 'downgrade', 'lateral'), defaultValue: 'upgrade' },
    status_mudanca: { type: DataTypes.ENUM('solicitada', 'processando', 'efetiva', 'cancelada'), defaultValue: 'solicitada' },
}, {
    tableName: 'saas_mudanca_plano',
    timestamps: false,
});

module.exports = SaasMudancaPlano;