const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = [];

io.on('connection', (socket) => {
  // Escuchar cuando un usuario se une
  socket.on('user joined', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('user list', users); // Enviar la lista de usuarios actualizada
  });

  // Escuchar los mensajes de chat
  socket.on('chat message', (msg) => {
    if (msg.to) {
      // Enviar mensaje privado
      const targetSocket = [...io.sockets.sockets.values()].find(
        (s) => s.username === msg.to
      );
      if (targetSocket) {
        targetSocket.emit('chat message', msg); // Enviar el mensaje al destinatario
        socket.emit('chat message', msg); // Mostrar el mensaje también al remitente
      }
    } else {
      // Enviar mensaje a todos
      io.emit('chat message', msg);
    }
  });

  // Escuchar cuando un usuario se desconecta
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== socket.username);
    io.emit('user list', users); // Enviar la lista de usuarios actualizada
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
