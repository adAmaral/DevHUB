const express = require('express');
const router = express.Router();
const respostasSuporteController = require('../controllers/respostasSuporteController');

router.get('/', respostasSuporteController.getAll);
router.get('/:id', respostasSuporteController.getById);
router.post('/', respostasSuporteController.create);
router.put('/:id', respostasSuporteController.update);
router.delete('/:id', respostasSuporteController.remove);

module.exports = router;