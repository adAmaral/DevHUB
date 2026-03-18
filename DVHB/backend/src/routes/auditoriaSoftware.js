const express = require('express');
const router = express.Router();
const auditoriaSoftwareController = require('../controllers/auditoriaSoftwareController');

router.get('/', auditoriaSoftwareController.getAll);
router.get('/:id', auditoriaSoftwareController.getById);
router.post('/', auditoriaSoftwareController.create);
router.put('/:id', auditoriaSoftwareController.update);
router.delete('/:id', auditoriaSoftwareController.remove);

module.exports = router;
