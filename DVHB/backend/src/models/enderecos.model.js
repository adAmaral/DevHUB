const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Endereco = sequelize.define('Endereco', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('residencial', 'comercial'), allowNull: false },
    Endereco: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.STRING, allowNull: false },
    complemento: { type: DataTypes.STRING, allowNull: true },
    bairro: { type: DataTypes.STRING, allowNull: false },
    cidade: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false },
    cep: { type: DataTypes.STRING, allowNull: false },
    principal: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'enderecos',
        timestamps: false,
    });
module.exports = Endereco;
