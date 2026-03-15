const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CupomSoftware = sequelize.define('CupomSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    codigo: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    data_inicio: { type: DataTypes.DATE, allowNull: true },
    data_fim: { type: DataTypes.DATE, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'cupons_software',
    timestamps: false,
});

module.exports = CupomSoftware;
