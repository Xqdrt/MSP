import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const [crops, setCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({ name: '', quantity: '', plantingDate: '', harvestDate: '', price: '' });
  const [activeTab, setActiveTab] = useState('crops');
  const [pendingPayments, setPendingPayments] = useState([]);

  const mockPayments = [
    { date: '2023-08-01', amount: '$500', status: 'Completed' },
    { date: '2023-09-01', amount: '$300', status: 'Pending' },
  ];

  // List of random crops
  const randomCrops = [
    { id: 1, name: 'Wheat' },
    { id: 2, name: 'Rice' },
    { id: 3, name: 'Maize' },
    { id: 4, name: 'Barley' },
    { id: 5, name: 'Oats' },
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crops'); // GET request to fetch crops
        setCrops(response.data); // Update crops state with fetched data
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops(); // Call the fetch function on component mount
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (newCrop.name && newCrop.quantity && newCrop.price) {
        try {
            console.log('Adding crop:', newCrop); // Log the new crop
            const response = await axios.post('http://localhost:5000/api/crops', {
                name: newCrop.name,
                quantity: newCrop.quantity,
                plantingDate: newCrop.plantingDate, // Ensure this is included
                harvestDate: newCrop.harvestDate,   // Ensure this is included
                price: newCrop.price                  // Ensure this is included
            });
            console.log('Response from server:', response.data); // Log the server response
            setCrops([...crops, response.data]); // Update the crops state with the newly added crop
            setNewCrop({ name: '', quantity: '', plantingDate: '', harvestDate: '', price: '' }); // Reset the form
        } catch (error) {
            console.error('Error adding crop:', error);
        }
    }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop({ ...newCrop, [name]: value });
  };

  const handleMoveToPayment = (crop) => {
    setPendingPayments([...pendingPayments, crop]); 
    setCrops(crops.filter((item) => item !== crop)); 
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>MSP Dashboard</h1>
      </nav>
      <div className="dashboard-content">
        <aside className="sidebar">
          <button onClick={() => setActiveTab('crops')} className={activeTab === 'crops' ? 'active' : ''}>Crop Management</button>
          <button onClick={() => setActiveTab('payments')} className={activeTab === 'payments' ? 'active' : ''}>Payment Information</button>
        </aside>
        <main className="main-content">
          {activeTab === 'crops' && (
            <div className="crop-section">
              <h2>Crop Management</h2>
              <form onSubmit={handleAddCrop} className="add-crop-form">
                <h3>Add New Crop</h3>
                <select name="name" value={newCrop.name} onChange={handleInputChange} required>
                  <option value="">Select Crop</option>
                  {randomCrops.map((crop) => (
                    <option key={crop.id} value={crop.name}>{crop.name}</option>
                  ))}
                </select>
                <input type="number" name="quantity" value={newCrop.quantity} onChange={handleInputChange} placeholder="Quantity (kg)" required />
                <input type="date" name="plantingDate" value={newCrop.plantingDate} onChange={handleInputChange} placeholder="Planting Date" />
                <input type="date" name="harvestDate" value={newCrop.harvestDate} onChange={handleInputChange} placeholder="Expected Harvest Date" />
                <input type="number" name="price" value={newCrop.price} onChange={handleInputChange} placeholder="Price per kg" required />
                <button type="submit">Add Crop</button>
              </form>
              <div className="crop-list">
                <h3>Current Crops</h3>
                {crops.length === 0 ? (
                  <p>No crops added yet.</p>
                ) : (
                  <ul>
                    {crops.map((crop, index) => (
                      <li key={index} className="crop-item">
                        <strong>{crop.name}</strong> - {crop.quantity}kg
                        <br />
                        Price: ₹{crop.price}/{crop.unit}
                        <br />
                        Planting: {crop.plantingDate || 'N/A'}
                        <br />
                        Expected Harvest: {crop.harvestDate || 'N/A'}
                        <br />
                        <button onClick={() => handleMoveToPayment(crop)}>Move to Payment</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="payment-section">
              <h2>Payment Information</h2>
              {mockPayments.length === 0 && pendingPayments.length === 0 ? (
                <p>No payment information available.</p>
              ) : (
                <ul className="payment-list">
                  {mockPayments.map((payment, index) => (
                    <li key={index} className="payment-item">
                      <span className="payment-date">{payment.date}</span>
                      <span className="payment-amount">{payment.amount}</span>
                      <span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                    </li>
                  ))}
                  <h3>Pending Payments</h3>
                  {pendingPayments.map((payment, index) => (
                    <li key={index} className="payment-item">
                      <strong>{payment.name}</strong> - {payment.quantity}kg
                      <br />
                      Price: ₹{payment.price}/{payment.unit}
                      <br />
                      Planting: {payment.plantingDate || 'N/A'}
                      <br />
                      Expected Harvest: {payment.harvestDate || 'N/A'}
                      <span className="payment-status pending">Pending</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
