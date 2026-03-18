const express = require('express');
const router = express.Router();
const equipeDesenvolvimentoController = require('../controllers/equipeDesenvolvimentoController');

router.get('/', equipeDesenvolvimentoController.getAll);
router.get('/:id', equipeDesenvolvimentoController.getById);
router.post('/', equipeDesenvolvimentoController.create);
router.put('/:id', equipeDesenvolvimentoController.update);
router.delete('/:id', equipeDesenvolvimentoController.remove);

module.exports = router;