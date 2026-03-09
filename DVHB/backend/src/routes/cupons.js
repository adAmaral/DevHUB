const express = require('express');
const router = express.Router();
const cuponsController = require('../controllers/cuponsController');

router.get('/', cuponsController.getCupon);
router.post('/', cuponsController.createCupon);

module.exports = router;