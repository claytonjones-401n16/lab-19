'use strict';

const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const app = express();
const socket = require('socket.io-client').connect('http://localhost:3001');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/', (req, res, next) => {
  res.status(200).send('Homepage');
});

app.post('/post', (req, res, next) => {
  res.send('POSTING');
});

app.post('/test/:id/:name', (req, res, next) => {
  res.send(`testing ${req.params.id} ${req.params.name}`);
});

app.post('/delivery/:vendor/:orderid', (req, res, next) => {
  let payload = {
    vendor: req.params.vendor,
    orderID: req.params.orderid
  }
  
  console.log(`delivery { vendor: ${payload.vendor}, orderID: ${payload.orderID} }`);

  socket.emit('delivered', payload);

  res.status(200);
  res.send('Order logged in the system.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});