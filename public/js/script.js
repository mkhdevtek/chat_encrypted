const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');
const themeSelect = document.getElementById('theme-select');

// const encryption = encrypt_decrypt();


const rsa = new RSA();
let username = '';

// Al hacer clic en "Iniciar Chat"
startChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById('user-setup').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    localStorage.setItem('username', username);

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

    console.log('Message sent: ')
    console.table(message);
    // let message = input.value;
    const messageData = {
      username: username,
      message: message
    };
    socket.emit('chat message', messageData); // Enviar el mensaje con el nombre del usuario al servidor
    input.value = ''; // Limpiar el campo de entrada
  }
});

socket.on('public key', (publicKey) => {
  console.log('Public key received:', publicKey);
  localStorage.setItem('otherPublicKey', JSON.stringify(publicKey));
});

// Escuchar los mensajes desde el servidor
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  const messageContainer = document.createElement('div');
  let privateKey = JSON.parse(localStorage.getItem('privateKey'));


  let cryptedMsg = msg.message.message;
  let rows = decryptRSA(msg.message.rows, privateKey.d, privateKey.n);
  let cols = decryptRSA(msg.message.cols, privateKey.d, privateKey.n);
  let size = decryptRSA(msg.message.size, privateKey.d, privateKey.n);
  console.log('Rows received: ' + rows);
  console.log('Cols received: ' + cols);
  console.log('Size received: ' + size);
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
