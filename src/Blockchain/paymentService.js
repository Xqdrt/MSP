// src/blockchain/paymentService.js

import { web3 } from './web3Config';

// Send payment function for future scalability
const sendPayment = async (amountInRupees, recipientAddress) => {
  if (!web3) {
    console.error('Web3 is not initialized.');
    return;
  }

  const accounts = await web3.eth.getAccounts(); // Get the user's Ethereum accounts
  const senderAddress = accounts[0]; // Use the first account
  
  // Set exchange rate
  const exchangeRate = 50000; // 1 ETH = ₹50,000
  
  // Convert rupees to ETH
  const amountInEth = amountInRupees / exchangeRate; // Convert amount to ETH

  // Check if amountInEth is greater than the gas fee
  const gasPrice = await web3.eth.getGasPrice(); // Get the current gas price
  const estimatedGas = 21000; // Typical gas limit for a standard transaction
  const totalCostInEth = parseFloat(amountInEth) + (parseFloat(gasPrice) * estimatedGas) / 1e18; // Total cost in ETH

  // Proceed only if you have enough ETH
  const balance = await web3.eth.getBalance(senderAddress);
  if (parseFloat(balance) < totalCostInEth) {
    console.error('Insufficient funds for transaction.');
    return;
  }

  try {
    const tx = await web3.eth.sendTransaction({
      from: senderAddress,
      to: recipientAddress,
      value: web3.utils.toWei(amountInEth.toString(), 'ether'), // Convert the amount to wei
    });
    console.log('Transaction successful:', tx);
    return tx; // Return the transaction details if needed
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};



export { sendPayment };
