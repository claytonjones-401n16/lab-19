'use strict';


/**
 * Modularized vendor functions to be used by individual vendor applications
 *
 * @param {object} socket - A socket.io socket client
 * @param {string} store - The name of the vendor
 *
 * @example
 *
 *     vendor(socket, 'flower-shop)
 */

function vendor (socket, store) {
  socket.emit('subscribe', store);
  socket.emit('getAll', store);

  socket.on('delivered', (payload) => {
    payload.forEach(id => {
      console.log(`Thank you for delivering order ${id}`);
    });

    if (payload.length > 0) socket.emit('received', store);
  });
}

module.exports = vendor;