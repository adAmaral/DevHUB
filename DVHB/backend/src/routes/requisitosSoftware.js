const express = require('express');
const router = express.Router();
const requisitosSoftwareController = require('../controllers/requisitosSoftwareController');

router.get('/', requisitosSoftwareController.getAll);
router.get('/:id', requisitosSoftwareController.getById);
router.post('/', requisitosSoftwareController.create);
router.put('/:id', requisitosSoftwareController.update);
router.delete('/:id', requisitosSoftwareController.remove);

module.exports = router;