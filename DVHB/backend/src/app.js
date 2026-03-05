const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;