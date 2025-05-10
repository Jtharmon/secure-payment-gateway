// frontend/src/encryptUtils.js

import CryptoJS from 'crypto-js';

// Use a secret key (make sure to use the same key as the backend for decryption)
const SECRET_KEY = 'your-secret-key';  // Keep this key secure

// Encrypt card data before sending it to the backend
export const encryptCardData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encryptedData;
};

// encryptUtils.js
export async function encryptData(data, key) {
  const encoded = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );

  return {
    ciphertext: Buffer.from(encrypted).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
  };
}

export async function decryptData(ciphertext, key, iv) {
  const encryptedBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    cryptoKey,
    encryptedBytes
  );

  return new TextDecoder().decode(decrypted);
}

// Helper to generate a random AES key (256-bit)
export async function generateKey() {
  return crypto.getRandomValues(new Uint8Array(32)); // 256 bits
}
