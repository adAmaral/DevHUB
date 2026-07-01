const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const VersaoSoftware = sequelize.define('VersaoSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    versao: { type: DataTypes.STRING, allowNull: false },
    changelog: { type: DataTypes.TEXT, allowNull: true },
    data_lancamento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    versao_atual: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'versoes_software',
    timestamps: false,
});

module.exports = VersaoSoftware;
