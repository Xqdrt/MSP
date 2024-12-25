import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initWeb3, getWeb3Instance } from '../Blockchain/web3Config'; // Adjust the path as needed
import './ContractorDashboard.css';

const ContractorDashboard = () => {
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [availableCrops, setAvailableCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crops');
        setAvailableCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    const initializeWeb3 = async () => {
      await initWeb3(); // Initialize Web3
      fetchCrops(); // Fetch crops after initializing Web3
    };

    initializeWeb3();
  }, []);

  const handleAddToSelected = (cropToAdd) => {
    const selectionId = Date.now();
    setSelectedCrops(prevSelectedCrops => [
      ...prevSelectedCrops, 
      { 
        ...cropToAdd, 
        selectionId,
        orderQuantity: 1 
      }
    ]);
  };

  const handleQuantityChange = (selectionId, quantity) => {
    setSelectedCrops(prevSelectedCrops => 
      prevSelectedCrops.map(crop => 
        crop.selectionId === selectionId 
          ? { ...crop, orderQuantity: Math.min(parseInt(quantity) || 0, crop.quantity) }
          : crop
      )
    );
  };

  const handleRemoveCrop = (selectionId) => {
    setSelectedCrops(prevSelectedCrops => 
      prevSelectedCrops.filter(crop => crop.selectionId !== selectionId)
    );
  };

  const totalAmount = selectedCrops.reduce((sum, crop) => 
    sum + (crop.price * crop.orderQuantity), 0
  );

  const handleProceedToPayment = async () => {
    const web3 = getWeb3Instance(); // Get the Web3 instance
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      
      // Check if wallet is connected
      if (accounts.length === 0) {
        alert('Please connect your wallet to proceed with payment.');
        console.log('Wallet not connected');
        return;
      }

      // Check if there are selected crops
      if (selectedCrops.length === 0) {
        alert('Please select crops to proceed with payment.');
        console.log('No crops selected');
        return;
      }

      // Proceed with payment if everything is valid
      if (totalAmount > 0) {
        const fromAddress = accounts[0];

        try {
          const txReceipt = await web3.eth.sendTransaction({
            from: fromAddress,
            to: '0x6822ae3ED87c2B1C376890Fe0F02C6D986154295', // Replace with the address you want to send funds to
            value: web3.utils.toWei(totalAmount.toString(), 'ether'), // Convert amount to Wei
          });
          console.log('Transaction successful:', txReceipt);
          alert('Payment successful!');
          setSelectedCrops([]); // Clear selected crops after successful payment
        } catch (error) {
          console.error('Payment failed:', error);
          alert('Payment failed. Check the console for details.');
        }
      } else {
        alert('Total amount must be greater than zero.');
        console.log('Total amount is zero');
      }
    } else {
      alert('Web3 is not initialized. Please check your setup.');
      console.log('Web3 not initialized');
    }
  };

  return (
    <div className="contr-dashboard-wrapper">
      <nav className="contr-nav">
        <h1>MSP Dashboard</h1>
      </nav>
      <div className="contr-content-layout">
        <aside className="contr-sidebar">
          <button 
            onClick={() => setActiveTab('available')} 
            className={`contr-nav-btn ${activeTab === 'available' ? 'contr-nav-btn-active' : ''}`}
          >
            Available Crops
          </button>
          <button 
            onClick={() => setActiveTab('selected')} 
            className={`contr-nav-btn ${activeTab === 'selected' ? 'contr-nav-btn-active' : ''}`}
          >
            Selected & Payment {selectedCrops.length > 0 && `(${selectedCrops.length})`}
          </button>
        </aside>
        <main className="contr-main">
          {activeTab === 'available' && (
            <div className="contr-crops-section">
              <h2>Available Crops</h2>
              <div className="contr-crops-grid">
                {availableCrops.map((crop) => (
                  <div key={crop.id} className="contr-crop-card">
                    <div className="contr-crop-info">
                      <strong>{crop.name}</strong>
                      <p>Price: ₹{crop.price}/{crop.unit}</p>
                      <p>Available: {crop.quantity} {crop.unit}</p>
                      <p>Selected: {
                        selectedCrops.filter(selected => selected.id === crop.id).length
                      } times</p>
                    </div>
                    <button 
                      onClick={() => handleAddToSelected(crop)}
                      className="contr-add-btn"
                    >
                      Add to Selection
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'selected' && (
            <div className="contr-payment-section">
              <h2>Selected Crops & Payment</h2>
              <div className="contr-selected-list">
                {selectedCrops.length === 0 ? (
                  <p>No crops selected yet.</p>
                ) : (
                  <>
                    {selectedCrops.map((crop) => (
                      <div key={crop.selectionId} className="contr-selected-item">
                        <div className="contr-selected-info">
                          <strong>{crop.name}</strong>
                          <p>Price: ₹{crop.price}/{crop.unit}</p>
                        </div>
                        <div className="contr-quantity-box">
                          <input
                            type="number"
                            value={crop.orderQuantity}
                            onChange={(e) => handleQuantityChange(crop.selectionId, e.target.value)}
                            min="1"
                            max={crop.quantity}
                            placeholder="Quantity"
                            className="contr-quantity-input"
                          />
                          <span>{crop.unit}</span>
                          <button 
                            onClick={() => handleRemoveCrop(crop.selectionId)}
                            className="contr-remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="contr-summary-box">
                      <h3>Payment Summary</h3>
                      {selectedCrops.map((crop) => (
                        <div key={crop.selectionId} className="contr-summary-item">
                          <span>{crop.name} ({crop.orderQuantity} {crop.unit})</span>
                          <span>₹{crop.price * crop.orderQuantity}</span>
                        </div>
                      ))}
                      <div className="contr-total">
                        <strong>Total Amount:</strong>
                        <strong>₹{totalAmount}</strong>
                      </div>
                      <button 
                        className="contr-proceed-btn"
                        disabled={totalAmount === 0 || selectedCrops.length === 0} // Disable if no crops selected or total amount is zero
                        onClick={handleProceedToPayment}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContractorDashboard;
