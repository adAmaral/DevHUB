const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const CicloPagamento = sequelize.define('CicloPagamento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedor_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_ciclo: { type: DataTypes.ENUM('diario', 'semanal', 'quinzenal', 'mensal'), defaultValue: 'mensal' },
    dia_pagamento: { type: DataTypes.INTEGER },
    mes_pagamento: { type: DataTypes.INTEGER },
    valor_minimo_liberacao: { type: DataTypes.DECIMAL(12, 2) },
    proxima_data_pagamento: { type: DataTypes.DATEONLY },
    ultima_data_pagamento: { type: DataTypes.DATEONLY },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'ciclo_pagamento',
    timestamps: false,
});

module.exports = CicloPagamento;