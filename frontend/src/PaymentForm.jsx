// frontend/src/PaymentForm.jsx

import React, { useState } from 'react';
import { sendPaymentData } from './api';  // Import the API function
import { encryptCardData } from './encryptUtils';

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Helper function for validating card number
  const validateCardNumber = (cardNumber) => {
    const regex = /^[0-9]{16}$/;  // Simple 16-digit card validation
    return regex.test(cardNumber);
  };

  // Helper function for validating expiration date (MM/YY format)
  const validateExpirationDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    return regex.test(date);
  };

  // Helper function for validating CVV (3 digits)
  const validateCVV = (cvv) => {
    const regex = /^[0-9]{3}$/;
    return regex.test(cvv);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Please enter a 16-digit card number.');
      return;
    }
    if (!validateExpirationDate(expirationDate)) {
      setError('Invalid expiration date. Please use MM/YY format.');
      return;
    }
    if (!validateCVV(cvv)) {
      setError('Invalid CVV. Please enter a 3-digit CVV.');
      return;
    }
    if (amount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    // Encrypt the payment details on the client-side
    const encryptedCard = encryptCardData(cardNumber);
    const encryptedCvv = encryptCardData(cvv);
    const encryptedExpirationDate = encryptCardData(expirationDate);

    const paymentData = {
      card_number: encryptedCard,
      expiration_date: encryptedExpirationDate,
      cvv: encryptedCvv,
      amount: amount,
    };

    try {
      const response = await sendPaymentData(paymentData);
      setMessage(response.message);  // Assuming the response has a message
      setError('');
    } catch (error) {
      setMessage('');
      setError('Error processing payment: ' + (error.response?.data || error));
    }
  };

  return (
    <div>
      <h2>Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
        <br />

        <label>Expiration Date (MM/YY):</label>
        <input
          type="text"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
        <br />

        <label>CVV:</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
        <br />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <br />

        <button type="submit">Submit Payment</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;
