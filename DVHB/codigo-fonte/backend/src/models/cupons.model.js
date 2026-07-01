const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const cupon = sequelize.define('Cupon', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING, unique: true, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: true },
    tipo: { type: DataTypes.ENUM('percentual', 'valor_fixo'), allowNull: false },
    valor: { type: DataTypes.FLOAT, allowNull: false },
    minimo_compra: { type: DataTypes.FLOAT, allowNull: true },
    quantitade_total: { type: DataTypes.INTEGER, allowNull: true },
    quantidade_usada: { type: DataTypes.INTEGER, defaultValue: 0 },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    data_inicio: { type: DataTypes.DATE, allowNull: true },
    data_fim: { type: DataTypes.DATE, allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
    {
        tableName: 'cupons',
        timestamps: false,
    });
module.exports = cupon;