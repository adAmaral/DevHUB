const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

router.get('/', enderecoController.getAll);
router.get('/:id', enderecoController.getById);
router.post('/', enderecoController.create);
router.put('/:id', enderecoController.update);
router.delete('/:id', enderecoController.remove);

module.exports = router;