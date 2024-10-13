const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');
const themeSelect = document.getElementById('theme-select');
const usersList = document.getElementById('users');
let username = '';
let selectedUser = ''; // Usuario seleccionado para mensajes directos

// Al hacer clic en "Iniciar Chat"
startChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById('user-setup').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
    socket.emit('user joined', username);
  }
});

// Escuchar el envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && username) {
    const messageData = {
      username: username,
      message: input.value,
      to: selectedUser // Enviar el mensaje al usuario seleccionado
    };
    socket.emit('chat message', messageData); // Enviar el mensaje al servidor
    input.value = ''; // Limpiar el campo de entrada
  }
});

// Escuchar los mensajes desde el servidor
socket.on('chat message', (msg) => {
  if (msg.to === selectedUser || msg.username === username || !msg.to) {
    const item = document.createElement('li');
    const messageContainer = document.createElement('div');
  
    item.textContent = msg.message;
    if (msg.username === username) {
      messageContainer.classList.add('my-message-container');
      item.classList.add('my-message');
    } else {
      messageContainer.classList.add('message-container');
      item.classList.add('message');
      // Añadir el nombre del remitente a los mensajes recibidos
      const usernameElement = document.createElement('strong');
      usernameElement.textContent = msg.username + ': ';
      item.prepend(usernameElement);
    }
  
    messageContainer.appendChild(item);
    messages.appendChild(messageContainer); // Añadir el mensaje a la lista
    window.scrollTo(0, document.body.scrollHeight); // Desplazarse hacia abajo automáticamente
  }
});

// Actualizar la lista de usuarios conectados
socket.on('user list', (users) => {
  usersList.innerHTML = ''; // Limpiar la lista de usuarios

  users.forEach((user) => {
    if (user !== username) { // Evitar añadir al usuario actual a la lista
      const userItem = document.createElement('li');
      userItem.textContent = user;
      userItem.addEventListener('click', () => {
        selectedUser = user; // Seleccionar usuario para mensajes privados
        alert(`Enviando mensajes a ${user}`);
        loadChatForUser(selectedUser); // Cargar el chat del usuario seleccionado
      });
      usersList.appendChild(userItem);
    }
  });
});

// Cargar mensajes de chat para un usuario seleccionado
function loadChatForUser(user) {
  messages.innerHTML = ''; // Limpiar la caja de mensajes
  if (!user) {
    const noChatMessage = document.createElement('li');
    noChatMessage.textContent = 'No has seleccionado ningún chat.';
    messages.appendChild(noChatMessage);
  } else {
    const userChatMessage = document.createElement('li');
    userChatMessage.textContent = `Chat iniciado con ${user}.`;
    messages.appendChild(userChatMessage);
  }
}

// Cargar chat vacío al iniciar
loadChatForUser('');

// Cambiar tema al seleccionar una opción
themeSelect.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});
