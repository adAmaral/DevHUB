const express = require('express');
const router = express.Router();
const midiaSoftwareController = require('../controllers/midiaSoftwareController');

router.get('/', midiaSoftwareController.getAll);
router.get('/:id', midiaSoftwareController.getById);
router.post('/', midiaSoftwareController.create);
router.put('/:id', midiaSoftwareController.update);
router.delete('/:id', midiaSoftwareController.remove);

module.exports = router;