// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Dono routes ko import karna
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // <-- Naya Post Route import

// Dotenv ko configure karna
dotenv.config();

// ---- Database Connection Function ----
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Connection message ko yahan move kar diya
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Database se connect karna
connectDB();
// ------------------------------------

const app = express();

// JSON data ko samajhne ke liye middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Social Media API is running...');
});

// --- API Routes ---

// User routes ko use karna
app.use('/api/users', userRoutes);

// --- YEH NAYI LINE ADD HUI HAI ---
// Jab bhi koi /api/posts par aaye, toh postRoutes file check karo
app.use('/api/posts', postRoutes);
// ---------------------------------

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} par start ho gaya hai`);
});