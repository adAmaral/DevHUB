const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const PagamentoAfiliado = sequelize.define('PagamentoAfiliado', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    afiliado_id: { type: DataTypes.INTEGER, allowNull: false },
    valor_total: { type: DataTypes.DECIMAL(12, 2) },
    quantidade_comissoes: { type: DataTypes.INTEGER },
    periodo_inicio: { type: DataTypes.DATEONLY },
    periodo_fim: { type: DataTypes.DATEONLY },
    status_pagamento: { type: DataTypes.ENUM('processando', 'agendado', 'pago', 'falha'), defaultValue: 'processando' },
    data_pagamento: { type: DataTypes.DATEONLY },
    metodo_pagamento: { type: DataTypes.STRING(50) },
    comprovante_transacao: { type: DataTypes.STRING(255) },
}, {
    tableName: 'pagamento_afiliado',
    timestamps: false,
});

module.exports = PagamentoAfiliado;