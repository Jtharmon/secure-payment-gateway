import React, { useState } from 'react';
import { sendPaymentData } from './api';
import { encryptData, generateKey } from './encryptUtils';

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateCardNumber = (num) => /^[0-9]{16}$/.test(num);
  const validateExpirationDate = (date) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date);
  const validateCVV = (cvv) => /^[0-9]{3}$/.test(cvv);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validate input
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number (must be 16 digits)');
      setLoading(false);
      return;
    }
    if (!validateExpirationDate(expirationDate)) {
      setError('Invalid expiration date format (MM/YY)');
      setLoading(false);
      return;
    }
    if (!validateCVV(cvv)) {
      setError('Invalid CVV (must be 3 digits)');
      setLoading(false);
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      // Generate AES key
      const key = await generateKey();

      // Encrypt each field
      const encryptedCard = await encryptData(cardNumber, key);
      const encryptedExp = await encryptData(expirationDate, key);
      const encryptedCvv = await encryptData(cvv, key);

      // Prepare payload
      const paymentData = {
        card_number: encryptedCard.ciphertext,
        expiration_date: encryptedExp.ciphertext,
        cvv: encryptedCvv.ciphertext,
        amount: amount,
        iv: encryptedCard.iv, // Same IV used for each (could generate new ones if needed)
        key: Array.from(new Uint8Array(key)) // ⚠️ Insecure for production; for demo only
      };

      const response = await sendPaymentData(paymentData);
      setMessage(response.message || 'Payment processed successfully.');
    } catch (err) {
      setError('Error processing payment: ' + (err.response?.data || err.message));
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Secure Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        /><br />

        <label>Expiration Date (MM/YY):</label>
        <input
          type="text"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        /><br />

        <label>CVV:</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        /><br />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default PaymentForm;
