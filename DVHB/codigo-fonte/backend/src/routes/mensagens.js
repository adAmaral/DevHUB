const express = require('express');
const router = express.Router();
const mensagensController = require('../controllers/mensagensController');

router.get('/', mensagensController.getAll);
router.get('/:id', mensagensController.getById);
router.post('/', mensagensController.create);
router.put('/:id', mensagensController.update);
router.delete('/:id', mensagensController.remove);

module.exports = router;
