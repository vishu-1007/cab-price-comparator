// Backend: Node.js with Express
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mock Data for Price Estimates
const getUberPrices = async (pickup, dropoff) => {
    return { service: "Uber", price: `$${(Math.random() * (15 - 5) + 5).toFixed(2)}` };
};

const getOlaPrices = async (pickup, dropoff) => {
    return { service: "Ola", price: `$${(Math.random() * (18 - 6) + 6).toFixed(2)}` };
};

const getRapidoPrices = async (pickup, dropoff) => {
    return { service: "Rapido", price: `$${(Math.random() * (10 - 4) + 4).toFixed(2)}` };
};

// Endpoint to fetch price comparisons
app.post('/compare', async (req, res) => {
    const { pickup, dropoff } = req.body;
    
    try {
        const uber = await getUberPrices(pickup, dropoff);
        const ola = await getOlaPrices(pickup, dropoff);
        const rapido = await getRapidoPrices(pickup, dropoff);

        res.json([uber, ola, rapido]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching price data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Frontend: React
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [prices, setPrices] = useState([]);

    const fetchPrices = async () => {
        try {
            const response = await axios.post('http://localhost:5000/compare', { pickup, dropoff });
            setPrices(response.data);
        } catch (error) {
            console.error('Error fetching prices', error);
        }
    };

    return (
        <div>
            <h1>Cab Price Comparator</h1>
            <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
            <input type="text" placeholder="Drop-off Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
            <button onClick={fetchPrices}>Compare Prices</button>
            <ul>
                {prices.map((price, index) => (
                    <li key={index}>{price.service}: {price.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
