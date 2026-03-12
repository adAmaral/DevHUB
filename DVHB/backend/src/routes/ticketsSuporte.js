const express = require('express');
const router = express.Router();
const ticketsSuporteController = require('../controllers/ticketsSuporteController');

router.get('/', ticketsSuporteController.getAll);
router.get('/:id', ticketsSuporteController.getById);
router.post('/', ticketsSuporteController.create);
router.put('/:id', ticketsSuporteController.update);
router.delete('/:id', ticketsSuporteController.remove);

module.exports = router;