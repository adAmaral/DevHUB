const express = require('express');
const router = express.Router();
const payMethodController = require('../controllers/payMethodController');

router.get('/', payMethodController.getPayMethods);
router.get('/:id', payMethodController.getPayMethodById);
router.post('/', payMethodController.createPayMethod);
router.put('/:id', payMethodController.updatePayMethod);
router.delete('/:id', payMethodController.deletePayMethod);

module.exports = router;