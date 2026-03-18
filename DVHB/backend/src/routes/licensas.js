const express = require('express');
const router = express.Router();
const licencasController = require('../controllers/licencasController');

router.get('/', licencasController.getAll);
router.get('/:id', licencasController.getById);
router.post('/', licencasController.create);
router.put('/:id', licencasController.update);
router.delete('/:id', licencasController.remove);

module.exports = router;