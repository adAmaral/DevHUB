const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define('Usuarios', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type : DataTypes.STRING, unique: true, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, unique: true, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: true },
    foto_perfil: { type: DataTypes.STRING, allowNull: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_ultimo_acesso: { type: DataTypes.DATE, allowNull: true },
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
},
    {
        tableName: 'usuarios',
        timestamps: false,
    });

module.exports = User;