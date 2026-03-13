const exporess = require('express');
const router = exporess.Router();
const telemetriaController = require('../controllers/telemetriaController');

router.get('/', telemetriaController.getAll);
router.get('/:id', telemetriaController.getById);
router.post('/', telemetriaController.create);
router.put('/:id', telemetriaController.update);
router.delete('/:id', telemetriaController.remove);

module.exports = router;