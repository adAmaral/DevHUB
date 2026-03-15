const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const ImpressoesProduto = sequelize.define('ImpressoesProduto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER },
    pagina_origem: { type: DataTypes.STRING(500) },
    posicao_listagem: { type: DataTypes.INTEGER },
    tipo_listagem: { type: DataTypes.STRING(50) },
    data_impressao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'impressoes_produto',
    timestamps: false,
});

module.exports = ImpressoesProduto;