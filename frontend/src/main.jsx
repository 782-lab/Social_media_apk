// frontend/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- YEH DO LINES ZAROORI HAIN ---
import axios from 'axios';
// Yahaan apne naye Render backend ka URL daalein
axios.defaults.baseURL = 'https://social-media-apk-zn72.onrender.com'; 
// ---------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)