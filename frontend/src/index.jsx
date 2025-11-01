// frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// ✅ Create root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ Render the main app inside StrictMode (helps catch potential issues)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
