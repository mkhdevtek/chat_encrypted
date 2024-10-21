const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inicialización de la aplicación
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos
app.use(express.static('public'));

// Manejar la conexión de los clientes
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Cuando un usuario se une al chat
  socket.on('user joined', (username) => {
    io.emit('public key', username); // Enviar la clave pública a todos los clientes conect
    console.log(`${username.username} se ha unido al chat`);
    console.table(username);
  });

  // Escuchar el evento 'chat message' y reenviar el mensaje
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Envía el mensaje a todos los clientes conectados
    console.table(msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
