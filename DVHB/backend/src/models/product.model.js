const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Product = sequelize.define('Product', {
    nome: { type: DataTypes.STRING, allowNull: false },
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoria: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    preco_original: { type: DataTypes.FLOAT, allowNull: false },
    estoque: { type: DataTypes.INTEGER, allowNull: false },
    imagem_principal: { type: DataTypes.STRING, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: true },
    quantidade_avaliacoes: { type: DataTypes.INTEGER, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'produtos',
        timestamps: false,
    });
module.exports = Product;