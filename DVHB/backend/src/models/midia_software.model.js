const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const MidiaSoftware = sequelize.define('MidiaSoftware', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_midia: { type: DataTypes.STRING, allowNull: true },
    caminho: { type: DataTypes.STRING, allowNull: true },
    descricao: { type: DataTypes.STRING, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'midia_software',
    timestamps: false,
});

module.exports = MidiaSoftware;
