// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- 1. YEH NAYI LINE ADD HUI HAI

// Dono routes ko import karna
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); 

dotenv.config();

// ---- Database Connection Function ----
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
// ------------------------------------

const app = express();

// --- YEH NAYI LINES ADD HUI HAIN ---
// CORS ko istemal karna (taaki frontend se request aa sake)
app.use(cors()); 
// ---------------------------------

// JSON data ko samajhne ke liye middleware
app.use(express.json());

const PORT = process.env.PORT || 5000; // Render PORT ko automatically handle karega

app.get('/', (req, res) => {
  res.send('Social Media API is running...');
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}  start on port`);
});