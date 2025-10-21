require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const usersRouter = require('./routes/users');

app.use(cors());
app.use(express.json());

app.use('/', express.static(__dirname));
app.use('/api', usersRouter);

app.listen(port, () => {
  console.log(`DevHUB backend running on http://localhost:${port}`);
});
