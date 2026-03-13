const TelemetriaSoftware = require('../models/telemetria_software.model');
const Telemetria = require('../models/telemetria_software.model');

exports.getAll = async (req, res) => {
    try {
        const where = {};

        if (req.query.licenca_id) where.licenca_id = req.query.licenca_id;
        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.evento_tipo_id) where.evento_tipo_id = req.query.evento_tipo_id;
        if (req.query.sessao_id) where.sessao_id = req.query.sessao_id;

        const eventos = await TelemetriaSoftware.findAll({ where });
        res.json(eventos);
    }
    catch (err) {
        next(err);
        }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const evento = await TelemetriaSoftware.findByPk(id);

        if (!evento) {
            return res.status(404).json({ message: 'Evento de telemetria não encontrado' });
        }

        res.json(evento);
    }
    catch (err) {
        next(err);
        }
};

exports.create = async (req, res, next) => {
    try {
        const evento = await TelemetriaSoftware.create(req.body);
        res.status(201).json(evento);
    }
    catch (err) {
        next(err);
        }   
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const evento = await TelemetriaSoftware.findByPk(id);

        if (!evento) {
            return res.status(404).json({ message: 'Evento de telemetria não encontrado' });
        }

        await evento.update(req.body);
        res.json(evento);
    }
    catch (err) {
        next(err);

        }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const evento = await TelemetriaSoftware.findByPk(id);

        if (!evento) {
            return res.status(404).json({ message: 'Evento de telemetria não encontrado' });
        }

        await evento.destroy();
        res.status(204).send();
    }
    catch (err) {
        next(err);
        }
};