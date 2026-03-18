const express = require('express');
const router = express.Router();
const estatisticasSoftwareController = require('../controllers/estatisticasSoftwareController');

router.get('/', estatisticasSoftwareController.getAll);
router.get('/:id', estatisticasSoftwareController.getById);
router.post('/', estatisticasSoftwareController.create);
router.put('/:id', estatisticasSoftwareController.update);
router.delete('/:id', estatisticasSoftwareController.remove);

module.exports = router;