'use strict';

const io = require('socket.io')(3001);

// Message queue

let queue = {
  flower: [],
  candy: []
}

// Handler functions

/**
 * This function is a handler for the getAll event from sockets. The getAll event should be triggered when sockets first connect. It sends an array of orderIDs to the correct socket room.
 *
 * @param {string} payload - The store name in which to send orderIDs to
 *
 * @example
 *
 *     getAll('flower-shop')
 */

function getAll (payload) {
  if (payload === 'flower-shop') {
    io.to('flower-shop').emit('delivered', queue.flower);
  } else if (payload === 'candy-shop') {
    io.to('candy-shop').emit('delivered', queue.candy);
  }
}

/**
 * This function is a handler for the delivered event from the API server. The delivered event should be triggered any time a POST /delivery/:vendor/:orderid route is hit. It sends an array of orderIDs to the correct socket room.
 *
 * @param {object} payload - An object containing order data
 *
 * @example
 *
 *     delivered({ vendor: 'flower-shop', orderID: '001'});
 */

function delivered (payload) {
  if (payload.vendor === 'flower-shop') {
    queue.flower.push(payload.orderID);
    io.to('flower-shop').emit('delivered', queue.flower);
  } else if (payload.vendor === 'candy-shop') {
    queue.candy.push(payload.orderID);
    io.to('candy-shop').emit('delivered', queue.candy);
  }
}

/**
 * This function is a handler for the received event from the socket client. This event is is emitted from the sockets when they successfully receives messages. This function then erases all messages that were stored.
 *
 * @param {string} payload - The store name which received the messages
 *
 * @example
 *
 *     received('flower-shop');
 */


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