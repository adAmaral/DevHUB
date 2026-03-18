const express = require('express');
const router = express.Router();
const fornecedoresController = require('../controllers/fornecedoresController');

router.get('/', fornecedoresController.getAll);
router.get('/:id', fornecedoresController.getById);
router.post('/', fornecedoresController.create);
router.put('/:id', fornecedoresController.update);
router.delete('/:id', fornecedoresController.remove);

module.exports = router;