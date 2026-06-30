const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../utils/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(14),
        unique: true,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    foto_perfil: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    data_ultimo_acesso: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    tipo_conta: {
        type: DataTypes.ENUM('freelancer', 'empresa fornecedora', 'empresa consumidora', 'usuario'),
        defaultValue: 'usuario',
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ['senha'] },
    },
    scopes: {
        withPassword: {
            attributes: { include: ['senha'] },
        },
    },
});

// Aplica hash na senha antes de criar o registro
Usuario.beforeCreate(async (usuario) => {
    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(usuario.senha, salt);
});

// Aplica hash na senha antes de atualizar, somente se o campo foi alterado
Usuario.beforeUpdate(async (usuario) => {
    if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
    }
});

module.exports = Usuario;
