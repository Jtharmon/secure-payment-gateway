// frontend/src/encryptUtils.js

import CryptoJS from 'crypto-js';

// Use a secret key (make sure to use the same key as the backend for decryption)
const SECRET_KEY = 'your-secret-key';  // Keep this key secure

// Encrypt card data before sending it to the backend
export const encryptCardData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encryptedData;
};
