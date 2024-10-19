const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');
const themeSelect = document.getElementById('theme-select');

// const encryption = encrypt_decrypt();

let username = '';

// Al hacer clic en "Iniciar Chat"
startChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById('user-setup').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    socket.emit('user joined', username);
  }
});

// Escuchar el envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && username) {
    let message = send_message(input.value);
    // let message = input.value;
    const messageData = {
      username: username,
      message: message
    };
    socket.emit('chat message', messageData); // Enviar el mensaje con el nombre del usuario al servidor
    input.value = ''; // Limpiar el campo de entrada
  }
});

// Escuchar los mensajes desde el servidor
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  const messageContainer = document.createElement('div');

  let cryptedMsg = msg.message.message;
  let rows = msg.message.rows;
  let cols = msg.message.cols;
  let size = msg.message.size;
  console.log('Message received: ' + cryptedMsg);
  let textMsg = decrypt_RC(cryptedMsg, rows, cols, size);
  console.log('Message decrypted: ' + textMsg);

  item.textContent = textMsg;
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
});

// Cambiar tema al seleccionar una opción
themeSelect.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});
