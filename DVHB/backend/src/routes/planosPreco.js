const express = require('express');
const router = express.Router();
const planosPrecoController = require('../controllers/planosPrecoController')

router.get('/', planosPrecoController.getAll);
router.get('/:id', planosPrecoController.getById);
router.post('/', planosPrecoController.create);
router.put('/:id', planosPrecoController.update);
router.delete('/:id', planosPrecoController.remove);

module.exports = router;