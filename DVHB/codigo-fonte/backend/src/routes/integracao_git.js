const express = require('express');
const router = express.Router();
const integracaoGitController = require('../controllers/integracaoGitController');

router.get('/', integracaoGitController.getAll);
router.get('/:id', integracaoGitController.getById);
router.post('/', integracaoGitController.create);
router.put('/:id', integracaoGitController.update);
router.delete('/:id', integracaoGitController.remove);

module.exports = router;