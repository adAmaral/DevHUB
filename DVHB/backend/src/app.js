const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const enderecosRouter = require('./routes/endereco');
const carrinhoRouter = require('./routes/carrinho');
const pedidoRouter = require('./routes/pedido');
const itensPedidoRouter = require('./routes/itenspedido');
const payMethodRouter = require('./routes/paymethod');
const cuponsRouter = require('./routes/cupons');
const avaliacoesRouter = require('./routes/avaliacoes');
const webhooksRouter = require('./routes/webhooks');
const ticketsSuporteRouter = require('./routes/ticketsSuporte');
const telemetriaSoftwareRouter = require('./routes/TelemetriaSoftware');
const softwareRouter = require('./routes/software');
const respostasSuporteRouter = require('./routes/respostasSuporte');
const requisitosSoftwareRouter = require('./routes/requisitosSoftware');
const planosPrecoRouter = require('./routes/planosPreco');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/enderecos', enderecosRouter);
app.use('/api/carrinho', carrinhoRouter);
app.use('/api/pedidos', pedidoRouter);
app.use('/api/itenspedido', itensPedidoRouter);
app.use('/api/paymethods', payMethodRouter);
app.use('/api/cupons', cuponsRouter);
app.use('/api/avaliacoes', avaliacoesRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/tickets', ticketsSuporteRouter);
app.use('/api/telemetria', telemetriaSoftwareRouter);
app.use('/api/software', softwareRouter);
app.use('/api/respostas', respostasSuporteRouter);
app.use('/api/requisitos', requisitosSoftwareRouter);
app.use('/api/planospreco', planosPrecoRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;