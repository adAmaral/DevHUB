const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const SoftwareTag = sequelize.define('SoftwareTag', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tag: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'software_tags',
    timestamps: false,
});

module.exports = SoftwareTag;
