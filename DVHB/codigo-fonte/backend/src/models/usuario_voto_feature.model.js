const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UsuarioVotoFeature = sequelize.define('UsuarioVotoFeature', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    feature_id: { type: DataTypes.INTEGER, allowNull: false },
    voto: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'usuario_voto_feature',
    timestamps: false,
});

module.exports = UsuarioVotoFeature;
