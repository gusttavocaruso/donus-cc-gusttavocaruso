const express = require('express');
const router = require('./routes/routes');
const errorMD = require('./middlewares/error');

const app = express();
app.use(express.json());
app.use(router);
app.use(errorMD);


const PORT = 3000;
app.listen(PORT, () => console.log(`On at :${PORT} port!`));

module.exports = app;
