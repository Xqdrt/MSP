// server.js

import express from 'express';
import cors from 'cors'; // Import CORS
import connectDB from './config/database.js';
import Crop from './models/crop.js';

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Connect to the database
connectDB();

// API endpoint to get all crops
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await Crop.find(); // Fetch all crops from the database
        res.status(200).json(crops); // Send the crops data as a response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving crops', error });
    }
});

// API endpoint to add a new crop
app.post('/api/crops', async (req, res) => {
    try {
        const { name, quantity, plantingDate, harvestDate, price } = req.body; // Include price in destructuring
        const newCrop = new Crop({ name, quantity, plantingDate, harvestDate, price }); // Add price to new Crop instance
        const savedCrop = await newCrop.save(); // Save to the database
        res.status(201).json(savedCrop); // Send the saved crop as a response
    } catch (error) {
        res.status(500).json({ message: 'Error adding crop', error });
    }
});

const PORT = process.env.PORT || 5000; // Use the environment port or 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server start
});
