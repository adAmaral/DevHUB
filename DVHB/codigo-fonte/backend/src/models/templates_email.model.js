const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TemplatesEmail = sequelize.define('TemplatesEmail', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome_template: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    categoria: { type: DataTypes.STRING(50) },
    assunto_padrao: { type: DataTypes.STRING(255) },
    corpo_template: { type: DataTypes.TEXT },
    variaveis_suportadas: { type: DataTypes.JSON },
    criado_por: { type: DataTypes.INTEGER },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'templates_email',
    timestamps: false,
});

module.exports = TemplatesEmail;