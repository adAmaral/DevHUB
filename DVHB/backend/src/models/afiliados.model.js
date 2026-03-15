const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Afiliados = sequelize.define('Afiliados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    comissao_percentual: { type: DataTypes.DECIMAL(5, 2) },
    status_afiliado: { type: DataTypes.ENUM('ativo', 'inativo', 'suspenso', 'rejeitado'), defaultValue: 'ativo' },
    site_afiliado: { type: DataTypes.STRING(500) },
    metodos_promocao: { type: DataTypes.JSON },
    documento_verificado: { type: DataTypes.BOOLEAN, defaultValue: false },
    dados_bancarios_verificado: { type: DataTypes.BOOLEAN, defaultValue: false },
    data_cadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_vendas_geradas: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    total_comissao: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, {
    tableName: 'afiliados',
    timestamps: false,
});

module.exports = Afiliados;