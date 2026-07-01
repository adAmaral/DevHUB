const express = require('express');
const router = express.Router();
const TicketSuporteController = require('../controllers/TicketSuporteController');

router.get('/', TicketSuporteController.getAll);
router.get('/:id', TicketSuporteController.getById);
router.post('/', TicketSuporteController.create);
router.put('/:id', TicketSuporteController.update);
router.delete('/:id', TicketSuporteController.remove);

module.exports = router;