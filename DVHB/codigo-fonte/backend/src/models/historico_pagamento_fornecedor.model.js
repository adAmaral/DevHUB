const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const HistoricoPagamentoFornecedor = sequelize.define('HistoricoPagamentoFornecedor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    periodo_inicio: { type: DataTypes.DATEONLY },
    periodo_fim: { type: DataTypes.DATEONLY },
    cantidad_vendas: { type: DataTypes.INTEGER },
    valor_bruto: { type: DataTypes.DECIMAL(12, 2) },
    comissao_marketplace: { type: DataTypes.DECIMAL(12, 2) },
    impostos_retidos: { type: DataTypes.DECIMAL(12, 2) },
    ajustes: { type: DataTypes.DECIMAL(12, 2) },
    valor_liquido: { type: DataTypes.DECIMAL(12, 2) },
    status_pagamento: { type: DataTypes.ENUM('processando', 'agendado', 'pago', 'falha', 'retido'), defaultValue: 'processando' },
    data_programada_pagamento: { type: DataTypes.DATEONLY },
    data_pagamento_efetivo: { type: DataTypes.DATEONLY },
    meio_pagamento: { type: DataTypes.STRING(50) },
    numero_comprovante: { type: DataTypes.STRING(100) },
    observacoes: { type: DataTypes.TEXT },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'historico_pagamento_fornecedor',
    timestamps: false,
});

module.exports = HistoricoPagamentoFornecedor;