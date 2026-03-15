const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const VideoTutorials = sequelize.define('VideoTutorials', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    software_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(255) },
    descricao: { type: DataTypes.TEXT },
    url_video: { type: DataTypes.STRING(500) },
    duracao_segundos: { type: DataTypes.INTEGER },
    visualizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    categoria_tutorial: { type: DataTypes.STRING(100) },
    ordem: { type: DataTypes.INTEGER },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    data_upload: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'video_tutorials',
    timestamps: false,
});

module.exports = VideoTutorials;