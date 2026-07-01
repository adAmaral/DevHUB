const express = require('express');
const router = express.Router();
const licencasController = require('../controllers/licensasController');

router.get('/', licencasController.getAll);
router.get('/:id', licencasController.getById);
router.post('/', licencasController.create);
router.put('/:id', licencasController.update);
router.delete('/:id', licencasController.remove);

module.exports = router;