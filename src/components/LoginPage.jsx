import React, { useState } from 'react';
import './LoginPage.css'; // Import your CSS file
import backgroundImage from "../assets/FARM.jpg"; // Note the "../" to go up one level
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);
    setError('');

    // Simulated authentication
    setTimeout(() => {
      if (username === 'farmer' && password === 'password123') {
        alert('Login successful as Farmer');
        navigate('/farmer-dashboard');
      } else if (username === 'contractor' && password === 'contractor123') {
        alert('Login successful as Contractor');
        navigate('/contractor-dashboard');
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-card">
        <h2>Login</h2>
        <p>Enter your credentials to access the platform</p>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleLogin} disabled={isLoading || !username || !password}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
