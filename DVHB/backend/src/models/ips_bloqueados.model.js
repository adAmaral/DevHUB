const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const IpsBloqueados = sequelize.define('IpsBloqueados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ip_address: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    motivo: { type: DataTypes.STRING(255) },
    bloqueado_por: { type: DataTypes.INTEGER },
    data_bloqueio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_desbloqueio: { type: DataTypes.DATE },
    permanente: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'ips_bloqueados',
    timestamps: false,
});

module.exports = IpsBloqueados;