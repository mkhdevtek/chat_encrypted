
class RSA {
  constructor() {
    this.p = rand_prime_below(128);
    this.q = rand_prime_below(128);
    while (this.q == this.p) {
      this.q = rand_prime_below(128);
    }
    this.n = this.p * this.q;
    this.phi = calculate_phi(this.p, this.q);
    this.e = calculate_e(this.phi);
    this.d = calculate_d(this.e, this.phi);
  }
  publicKey() {
    return {
      e: this.e,
      n: this.n
    };
  }

  privateKey() {
    return {
      d: this.d,
      n: this.n
    };
  }
}

// Initiate the RSA key pair
function rand_prime_below(n) {
  let primes = [];
  if (n < 6)
    return 3;
  for (let i = 2; i < n; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j == 0) {
        isPrime = false;
      }
    }
    if (isPrime)
      primes.push(i);
  }
  return primes[Math.floor(Math.random() * primes.length)];
}

function gcd(a, b) {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

function calculate_phi(p, q) {
  return (p - 1) * (q - 1);
}

function calculate_e(phi) {
  let e = 2;
  while (e < phi) {
    if (gcd(e, phi) == 1) {
      break;
    }
    e++;
  }
  return e;
}

function calculate_d(e, phi) {
  let d = 1;
  while (d < phi) {
    if ((d * e) % phi == 1) {
      break;
    }
    d++;
  }
  return d;
}

function encryptRSA(m, e, n) {
  return m ** e % n;
}
function decryptRSA(c, d, n) {
  return c ** d % n;
}
