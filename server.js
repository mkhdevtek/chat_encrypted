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
  socket.on('user joined', (data) => {
    io.emit('public key', { username: data.username, publicKey: data.publicKey });
    // console.log(`${data.username} se ha unido al chat con su clave pública`);
    console.table(data);
    // console.table(data.username);
  });

  // Escuchar el evento 'chat message' y reenviar el mensaje
  socket.on('chat message', (data) => {
    io.emit('chat message', data); // Envía el mensaje a todos los clientes conectados
    console.table(data.message);
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
