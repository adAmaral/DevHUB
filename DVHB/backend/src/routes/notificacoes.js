const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoesController');

router.get('/', notificacoesController.getAll);
router.get('/:id', notificacoesController.getById);
router.post('/', notificacoesController.create);
router.put('/:id', notificacoesController.update);
router.delete('/:id', notificacoesController.remove);

module.exports = router;
