const crypto = require('crypto');

// ตัวอย่าง Key/IV (16 bytes สำหรับ AES-128)
const key1 = Buffer.from("1234567891234567", 'utf8');   // Key1
const iv1 = Buffer.from("s6504062636039za", 'utf8');     // IV1
const key2 = Buffer.from("1234567891234569", 'utf8');   // Key2
const iv2 = Buffer.from("s6504062636039za", 'utf8');    // IV2

// AES-CTR Encrypt
function aesEncrypt(value, key, iv) {
  const cipher = crypto.createCipheriv('aes-128-ctr', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// AES-CTR Decrypt
function aesDecrypt(encryptedBase64, key, iv) {
  const decipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Double Encrypt: Key1 → Key2
function doubleEncrypt(value) {
  const step1 = aesEncrypt(value, key1, iv1);
  const step2 = aesEncrypt(step1, key2, iv2);
  return step2; // base64
}

// Double Decrypt: Key2 → Key1
function doubleDecrypt(encrypted) {
  const step1 = aesDecrypt(encrypted, key2, iv2);
  const step2 = aesDecrypt(step1, key1, iv1);
  return step2;
}

// --- DEMO ---
const plaintext = JSON.stringify(1);
console.log("Plaintext:", plaintext);

const enc = doubleEncrypt(plaintext);
console.log("Double Encrypted (Base64):", enc);

const dec = doubleDecrypt(enc);
console.log("Decrypted Plaintext:", dec);
