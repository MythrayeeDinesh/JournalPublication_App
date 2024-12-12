import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure global styles are included
import App from './App.jsx'; // Main app entry
import { BrowserRouter } from 'react-router-dom'; // Router for navigation
import Master from './components/Master.jsx';

// Render the entire application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Master />
    </BrowserRouter>
  </StrictMode>
);
