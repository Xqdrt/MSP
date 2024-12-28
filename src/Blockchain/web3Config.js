// src/blockchain/web3Config.js

import Web3 from 'web3';

let web3;

// Function to initialize Web3
const initWeb3 = async () => {
  // Check if the browser has an Ethereum provider (like MetaMask)
  if (window.ethereum) {
    // Create a new instance of Web3 using the provider
    web3 = new Web3(window.ethereum);

    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      console.log('Ethereum accounts accessed:', accounts);
      return accounts; // Return the accounts for further use
      console.log("ee")
    } catch (error) {
      console.error('User denied account access:', error);
      throw new Error('User denied account access'); // Throw an error for handling in other parts of the app
    }
  } else {
    console.error('No Ethereum provider detected. Install MetaMask!');
    throw new Error('No Ethereum provider detected'); // Throw an error for handling
  }
};

// Function to get the Web3 instance
const getWeb3Instance = () => {
  if (!web3) {
    console.error('Web3 is not initialized. Call initWeb3() first.');
    return null; // Return null if Web3 is not initialized
  }
  return web3;
};

// Export the Web3 initialization function and getWeb3Instance
export { initWeb3, getWeb3Instance };
