const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/:usuario_id', pedidoController.getPedidosByUsuario);
router.post('/', pedidoController.createPedido);
router.put('/:id', pedidoController.updatePedido);
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;