const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');

router.get('/', avaliacoesController.getAll);
router.get('/:id', avaliacoesController.getById);
router.post('/', avaliacoesController.create);
router.put('/:id', avaliacoesController.update);
router.delete('/:id', avaliacoesController.remove);

module.exports = router;