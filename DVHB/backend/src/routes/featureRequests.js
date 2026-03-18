const express = require('express');
const router = express.Router();
const featuresRequestsController = require('../controllers/featuresRequestsController');

router.get('/', featuresRequestsController.getAll);
router.get('/:id', featuresRequestsController.getById);
router.post('/', featuresRequestsController.create);
router.put('/:id', featuresRequestsController.update);
router.delete('/:id', featuresRequestsController.remove);

module.exports = router;