const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/', wishlistController.getAll);
router.get('/:id', wishlistController.getById);
router.post('/', wishlistController.create);
router.put('/:id', wishlistController.update);
router.delete('/:id', wishlistController.remove);

module.exports = router;