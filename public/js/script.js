const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');
const themeSelect = document.getElementById('theme-select');
const myUser = document.getElementById('my-user');
const otherUser = document.getElementById('other-user');

const rsa = new RSA();
let username = '';

// Al hacer clic en "Iniciar Chat"
usernameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById('user-setup').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    localStorage.setItem('username', username);
    myUser.textContent = username;

    let publicKey = rsa.publicKey();
    let privateKey = rsa.privateKey();
    localStorage.setItem('publicKey', JSON.stringify(publicKey));
    localStorage.setItem('privateKey', JSON.stringify(privateKey));

    socket.emit('user joined', { username: username, publicKey: publicKey }); // Enviar el nombre del usuario al servidor
  }
});


// Escuchar el envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && username) {
    let message = send_message(input.value);
    const item = document.createElement('li');
    const messageContainer = document.createElement('div');

    // Obtener la hora actual
    const time = new Date();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const timeText = `${hours}:${minutes}`;

    // Crear el span para la hora
    const timeElement = document.createElement('span');
    timeElement.textContent = timeText;
    timeElement.classList.add('message-time'); // Añadir clase para estilo
    item.textContent = input.value;
    // Añadir clases a los elementos
    messageContainer.classList.add('my-message-container');
    item.classList.add('my-message');
    item.appendChild(timeElement);

    messageContainer.appendChild(item);
    messages.appendChild(messageContainer);
    window.scrollTo(0, document.body.scrollHeight);

    // let message = input.value;
    const messageData = {
      username: username,
      message: message
    };
    socket.emit('chat message', messageData); // Enviar el mensaje con el nombre del usuario al servidor
    input.value = ''; // Limpiar el campo de entrada
  }
});

socket.on('public key', (data) => {
  const item = document.createElement('li');
  item.textContent = data.username;
  // userslist.appendChild(item);
  if (data.username === username) return;
  otherUser.textContent = 'Chateando con: ' + data.username;
  localStorage.setItem('otherPublicKey', JSON.stringify(data.publicKey));
});

// Escuchar los mensajes desde el servidor
socket.on('chat message', (data) => {
  const item = document.createElement('li');
  const messageContainer = document.createElement('div');

  let privateKey = JSON.parse(localStorage.getItem('privateKey'));
  const time = new Date();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeText = `${hours}:${minutes}`;

  // Crear el span para la hora
  const timeElement = document.createElement('span');
  timeElement.textContent = timeText;
  timeElement.classList.add('message-time'); // Añadir clase para estilo

  let cryptedMsg = data.message.message;
  let rows = data.message.rows;
  let cols = data.message.cols;
  let size = data.message.size;
  rows = decryptRSA(rows, privateKey.d, privateKey.n);
  cols = decryptRSA(cols, privateKey.d, privateKey.n);
  size = decryptRSA(size, privateKey.d, privateKey.n);
  if (username !== data.username) {
    let textMsg = decrypt_RC(cryptedMsg, rows, cols, size);

    item.textContent = textMsg;
    messageContainer.classList.add('message-container');
    item.classList.add('message');
    item.appendChild(timeElement);
    // Añadir el nombre del remitente a los mensajes recibidos
    const usernameElement = document.createElement('strong');
    usernameElement.textContent = data.username + ': ';
    item.prepend(usernameElement);
  }
  messageContainer.appendChild(item);
  messages.appendChild(messageContainer); // Añadir el mensaje a la lista
  window.scrollTo(0, document.body.scrollHeight); // Desplazarse hacia abajo automáticamente
});

socket.on('disconnect', () => {
  localStorage.clear();
  localStorage.removeItem('username');
  localStorage.removeItem('publicKey');
  localStorage.removeItem('privateKey');
  localStorage.removeItem('otherPublicKey');
});

// Cambiar tema al seleccionar una opción
themeSelect.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});
