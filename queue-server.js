'use strict';

const io = require('socket.io')(3001);

// Message queue

let queue = {
  flower: [],
  candy: []
}

// Handler functions

function getAll (payload) {
  if (payload === 'flower-shop') {
    io.to('flower-shop').emit('delivered', queue.flower);
  } else if (payload === 'candy-shop') {
    io.to('candy-shop').emit('delivered', queue.candy);
  }
}

function delivered (payload) {
  if (payload.vendor === 'flower-shop') {
    queue.flower.push(payload.orderID);
    io.to('flower-shop').emit('delivered', queue.flower);
  } else if (payload.vendor === 'candy-shop') {
    queue.candy.push(payload.orderID);
    io.to('candy-shop').emit('delivered', queue.candy);
  }
}

function received (payload) {
  if (payload === 'flower-shop') {
    queue.flower = [];
  } else if (payload === 'candy-shop') {
    queue.candy = [];
  }
}

// Socket server events

io.on('connection', (socket) => {
  console.log(`Connected ${socket.id}`);

  socket.on('subscribe', (payload) => {
    socket.join(`${payload}`);
  });

  socket.on('getAll', getAll);

  socket.on('delivered', delivered);

  socket.on('received', received);
});