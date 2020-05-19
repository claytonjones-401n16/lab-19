'use strict';


// modularized function for vendors to utilize

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