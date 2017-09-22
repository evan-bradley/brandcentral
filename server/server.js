/*
 * server.js -- Main server entry-point.
 */
'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const expressSession = require('express-session');
const sharedSession = require('express-socket.io-session');

const sockets = {};

const session = expressSession({
    key: 'sessionId',
    secret: '89 5e 70 dd 53 37 7e 2c a4 55',
    resave: false,
    saveUninitialized: true
});

app.use(session);
io.use(sharedSession(session, { autoSave: true }));

io.on('connection', (sock, test) => {
  if (!sock.handshake.session.id) {
    sock.disconnect(true);
    return;
  }

  sockets[sock.handshake.session.id] = sock;

  sock.on('disconnect', () => {
    console.log('socket disconnected');
    delete sockets[sock.handshake.session.id];
  });
});

app.use(require('body-parser').json());
app.use(function(req, res, next) {
  if (!req.session || !req.session.id) {
    console.log('unauthorized user');
    res.send({ success: false, message: 'You are not authorized' });
    return;
  }
  req.sockets = sockets;
  next();
});

app.use(express.static(__dirname + '/../view/dist'));

const port = process.env.PORT || 8081;
server.listen(port);
console.log(`Listening on port ${port}`);
