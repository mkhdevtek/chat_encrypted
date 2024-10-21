function randomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function prime_below(n) {
  let primes = [];
  if (n < 6)
    return 3;
  for (let i = 0; i < n; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j == 0) {
        isPrime = false;
      }
    }
    if (isPrime)
      primes.push(i);
  }
  return primes[primes.length - 1];
}

function print_matrix(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    let row = '';
    for (let j = 0; j < matrix[i].length; j++) {
      row += matrix[i][j] + ' ';
    }
    console.log(row);
  }
}

function gen_rows(lenMsg) {
  return prime_below(lenMsg / (lenMsg / 100 + 1));
}

function gen_cols(mult, total) {
  let i = 1;
  while (mult * i < total + 2 && i != mult) {
    i++;
  }
  return (i == mult) ? i + 1 : i;
}

function gen_matrix(rows, cols) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push([]);
    for (let j = 0; j < cols; j++) {
      matrix[i].push('');
    }
  }
  return matrix;
}

function read_RC(matrix, textLen) {
  let msg = '';
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      msg += matrix[r][c];
    }
  }
  return msg.substring(1, textLen + 1);
}

function read_CR(matrix) {
  let msgEncrypted = '';
  for (let r = 0; r < matrix[0].length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      msgEncrypted += matrix[c][r];
    }
  }
  return msgEncrypted;
}

function read_CR(matrix, textLen = 0) {
  let msg = '';
  for (let r = 0; r < matrix[0].length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      msg += matrix[c][r];
    }
  }
  return (textLen == 0) ? msg : msg.substring(1, textLen + 1);
}

function fill_mat_RC(matrix, text) {
  let k = 0;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (k < text.length && matrix[r][c] === '') {
        matrix[r][c] = text[k];
        k++;
      }
      else if (matrix[r][c] == '' && k >= text.length) {
        matrix[r][c] = randomLetter();
      }
    }
  }
}

function encrypt_RC(text, rows, cols) {
  let msgEncrypted = '';

  let matrix = gen_matrix(rows, cols);
  matrix[0][0] = randomLetter();
  matrix[rows - 1][cols - 1] = randomLetter();

  fill_mat_RC(matrix, text);
  console.log('Matrix sent:');
  print_matrix(matrix);
  msgEncrypted = read_CR(matrix);
  console.log('Message sent:', msgEncrypted);
  return msgEncrypted;
}

function decrypt_RC(text, rows, cols, originalSize) {
  let msgDecrypted = '';
  let matrix = gen_matrix(cols, rows);
  let k = 0;
  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < rows; c++) {
      matrix[r][c] = text[k];
      k++;
    }
  }
  console.log('Matrix received:');
  print_matrix(matrix);
  msgDecrypted = read_CR(matrix, originalSize);
  return msgDecrypted;
}

function send_message(text) {
  // alert(text);
  let otherPublicKey = JSON.parse(localStorage.getItem('otherPublicKey'));

  let rows = gen_rows(text.length);
  let cols = gen_cols(rows, text.length);
  let encrypted = encrypt_RC(text, rows, cols);
  let size = text.length;

  console.log('Original data', text, rows, cols, size);

  rows = encryptRSA(rows, otherPublicKey.publicKey.e, otherPublicKey.publicKey.n);
  cols = encryptRSA(cols, otherPublicKey.publicKey.e, otherPublicKey.publicKey.n);
  size = encryptRSA(size, otherPublicKey.publicKey.e, otherPublicKey.publicKey.n);
  return { message: encrypted, rows: rows, cols: cols, size: size };
}