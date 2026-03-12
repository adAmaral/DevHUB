const TicketSuporte = require('../models/TicketSuporte');

exports.getAll = async (req, res, next) => {
    try {
        const where = {};

        if (req.query.software_id) where.software_id = req.query.software_id;
        if (req.query.usuario_id) where.usuario_id = req.query.usuario_id;
        if (req.query.status) where.status = req.query.status;

        const tickets = await TicketSuporte.findAll({ where });
        res.json(tickets);
        }
        catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await TicketSuporte.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket de suporte não encontrado' });
        }

        res.json(ticket);
        }
        catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const ticket = await TicketSuporte.create(req.body);
        res.status(201).json(ticket);
        }
        catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await TicketSuporte.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket de suporte não encontrado' });
        }

        await ticket.update(req.body);
        res.json(ticket);
        }
        catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await TicketSuporte.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket de suporte não encontrado' });
        }

        await ticket.destroy();
        res.status(204).send();
        }
        catch (err) {
        next(err);
    }
};