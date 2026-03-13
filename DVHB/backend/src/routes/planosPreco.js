const express = require('express');
const router = express.Router();
const planosPrecoController = require('../controllers/planosPrecoController')

router.get('/', planosPrecoController.getAll);
router.get('/:id', planosPrecoController.getById);
router.get('/', planosPrecoController.create);
router.get('/:id', planosPrecoController.update);
router.get('/:id', planosPrecoController.remove);

module.exports = router;