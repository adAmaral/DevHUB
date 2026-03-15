const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TentativasLoginFalhas = sequelize.define('TentativasLoginFalhas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255) },
    ip_address: { type: DataTypes.STRING(50) },
    tentativa_numero: { type: DataTypes.INTEGER, defaultValue: 1 },
    motivo: { type: DataTypes.STRING(255) },
    data_tentativa: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    bloqueado_ate: { type: DataTypes.DATE },
}, {
    tableName: 'tentativas_login_falhas',
    timestamps: false,
});

module.exports = TentativasLoginFalhas;