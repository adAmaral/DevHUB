const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UnsubscribeUsuario = sequelize.define('UnsubscribeUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING(255) },
    tipo_email: { type: DataTypes.STRING(50) },
    data_unsubscribe: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    motivo: { type: DataTypes.STRING(255) },
    resubscricao_permitida: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'unsubscribe_usuario',
    timestamps: false,
});

module.exports = UnsubscribeUsuario;