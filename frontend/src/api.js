// frontend/src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/payment';  // Replace with your backend URL

export const sendPaymentData = async (paymentData) => {
  try {
    const response = await axios.post(API_URL, paymentData);
    return response.data;  // assuming response contains a message or status
  } catch (error) {
    throw error.response?.data || 'An error occurred while processing the payment.';
  }
};
