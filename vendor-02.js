'use strict';

const socket = require('socket.io-client').connect('http://localhost:3001');

const vendor = require('./vendor-module.js');

// runs vendor function on current socket and candy-shop
vendor(socket, 'candy-shop');