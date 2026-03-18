const express = require('express');
const router = express.Router();
const devolucoesController = require('../controllers/devolucoesController');

router.get('/', devolucoesController.getAll);
router.get('/:id', devolucoesController.getById);
router.post('/', devolucoesController.create);
router.put('/:id', devolucoesController.update);
router.delete('/:id', devolucoesController.remove);

module.exports = router;
