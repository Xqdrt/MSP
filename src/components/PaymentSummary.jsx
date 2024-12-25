import React from 'react';
import { sendPayment } from '../Blockchain/paymentService'; // Adjust the path as necessary

const PaymentSummary = ({ pendingPayments }) => {
  const totalAmount = pendingPayments.reduce((total, crop) => {
    return total + (crop.price * crop.quantity);
  }, 0);

  const handlePayment = async () => {
    const recipientAddress = 'RECIPIENT_ADDRESS_HERE'; // Replace with actual address
    const amount = (totalAmount / 1000000000000000000).toString(); // Convert wei to ether for display

    if (totalAmount > 0) {
      try {
        await sendPayment(amount, recipientAddress);
        alert('Payment sent successfully!');
      } catch (error) {
        alert('Payment failed. Please try again.');
      }
    } else {
      alert('Total amount must be greater than zero.');
    }
  };

  return (
    <div>
      <h2>Payment Summary</h2>
      <p>Total Amount: ₹{totalAmount}</p>
      <button onClick={handlePayment}>Send Payment</button>
    </div>
  );
};

export default PaymentSummary;
