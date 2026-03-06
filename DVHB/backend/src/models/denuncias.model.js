const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Denuncia = sequelize.define('Denuncia', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('produto_falso', 'nao_entregue', 'descricao_incorreta', 'outro'), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pendente', 'em_analise', 'resolvida', 'rejeitada'), defaultValue: 'pendente' },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    { 
        tableName: 'denuncias',
        timestamps: false,
    });
module.exports = Denuncia;
