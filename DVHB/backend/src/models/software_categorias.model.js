const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SoftwareCategoria = sequelize.define('SoftwareCategoria', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'software_categorias',
    timestamps: false,
});

module.exports = SoftwareCategoria;
