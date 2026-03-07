const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Licenca = sequelize.define('Licenca', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
    tipo: { type: DataTypes.STRING, allowNull: true },
    validade: { type: DataTypes.DATE, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'licencas',
    timestamps: false,
});

module.exports = Licenca;
