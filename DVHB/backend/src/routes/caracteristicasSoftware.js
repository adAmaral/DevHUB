const express = require('express');
const router = express.Router();
const caracteristicasSoftwareController = require('../controllers/caracteristicasSoftwareController');

router.get('/', caracteristicasSoftwareController.getAll);
router.get('/:id', caracteristicasSoftwareController.getById);
router.post('/', caracteristicasSoftwareController.create);
router.put('/:id', caracteristicasSoftwareController.update);
router.delete('/:id', caracteristicasSoftwareController.remove);

module.exports = router;
