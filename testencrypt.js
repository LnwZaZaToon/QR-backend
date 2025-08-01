const crypto = require('crypto');
const { buffer } = require('stream/consumers');

// Helper: AES-CTR Encryption
function aesEncrypt(textBuffer, key, iv) {
  const cipher = crypto.createCipheriv('aes-128-ctr', key, iv);
  return Buffer.concat([cipher.update(textBuffer), cipher.final()]);
}

// Helper: AES-CTR Decryption
function aesDecrypt(cipherBuffer, key, iv) {
  const decipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
  return Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
}

// Encrypt with Key1, then Key2
function doubleEncrypt(plaintext, key1, key2) {
  const iv1 = Buffer.from("encryptionivgodz", 'utf8')
  const iv2 = Buffer.from("encryptionivgodz", 'utf8')

  const step1 = aesEncrypt(Buffer.from(plaintext, 'utf8'), key1, iv1);
  const step2 = aesEncrypt(step1, key2, iv2);
  console.log(step1.toString('base64'), " " , step2.toString('base64'))

  return {
    ciphertext: step2.toString('base64'), // ✅ base64 encoding
    iv1: iv1.toString('base64'),
    iv2: iv2.toString('base64')
  };
}

// Decrypt with Key2, then Key1
function doubleDecrypt(ciphertextBase64, key1, key2, iv1Base64, iv2Base64) {
  const iv1 = Buffer.from(iv1Base64, 'base64');
  const iv2 = Buffer.from(iv2Base64, 'base64');
  const encrypted = Buffer.from(ciphertextBase64, 'base64');

  const step1 = aesDecrypt(encrypted, key2, iv2);
  const step2 = aesDecrypt(step1, key1, iv1);

  return step2.toString('utf8'); // ✅ plain-text output
}

// --- DEMO ---
const key1 = Buffer.from("1234567891234567", 'utf8'); // 16 bytes
const key2 = Buffer.from("1234567891234569", 'utf8'); // 16 bytes


//const data = { roomid: "RM301", seatid: "34441", subjectid: "LAW123" };
const data = "1";
const message = JSON.stringify(data);
//console.log(key1)

const encrypted = doubleEncrypt(message, key1, key2);
console.log("Encrypted Output (Base64):", encrypted);

const decrypted = doubleDecrypt(encrypted.ciphertext, key1, key2, encrypted.iv1, encrypted.iv2);
console.log("Decrypted Plaintext:", decrypted);
