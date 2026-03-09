const express = require('express');
const router = express.Router();
const itensPedidoController = require('../controllers/ItensPedidoController');

router.get('/:pedido_id', itensPedidoController.getItensPedidoByPedidoId);
router.post('/', itensPedidoController.createItemPedido);

module.exports = router;