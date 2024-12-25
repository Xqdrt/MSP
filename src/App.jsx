import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage'; // Import the LoginPage component
import FarmerDashboard from './components/FarmerDashboard'; // Import the Farmer Dashboard
import ContractorDashboard from './components/ContractorDashboard'; // Import the Contractor Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
