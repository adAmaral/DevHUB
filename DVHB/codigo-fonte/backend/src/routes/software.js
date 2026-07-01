const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');

router.get('/', softwareController.getAll);
router.get('/:id', softwareController.getById);
router.post('/', softwareController.create);
router.put('/:id', softwareController.update);
router.delete('/:id', softwareController.remove);

module.exports = router;