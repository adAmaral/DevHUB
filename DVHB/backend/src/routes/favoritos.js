const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');

router.get('/', favoritosController.getAll);
router.get('/:id', favoritosController.getById);
router.post('/', favoritosController.create);
router.put('/:id', favoritosController.update);
router.delete('/:id', favoritosController.remove);

module.exports = router;