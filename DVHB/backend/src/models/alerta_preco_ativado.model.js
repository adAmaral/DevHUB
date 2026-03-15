const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AlertaPrecoAtivado = sequelize.define('AlertaPrecoAtivado', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    preco_limite: { type: DataTypes.DECIMAL(10, 2) },
    tipo_alerta: { type: DataTypes.ENUM('reducao', 'aumento', 'promocao'), defaultValue: 'reducao' },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'alerta_preco_ativado',
    timestamps: false,
});

module.exports = AlertaPrecoAtivado;