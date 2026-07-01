const express = require('express');
const router = express.Router();
const denunciasController = require('../controllers/denunciasController');

router.get('/', denunciasController.getAll);
router.get('/:id', denunciasController.getById);
router.post('/', denunciasController.create);
router.put('/:id', denunciasController.update);
router.delete('/:id', denunciasController.remove);

module.exports = router;
