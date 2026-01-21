import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';

// Simple loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'sans-serif',
    fontSize: '1.2em',
    color: '#666'
  }}>
    <div>
      <div style={{ fontSize: '2em', marginBottom: 10, textAlign: 'center' }}>🏫</div>
      <div>Loading School Platform...</div>
    </div>
  </div>
);

export default function App() {
  return (
    // Suspense removed to prevent perpetual Loading screen in production
    <AppRoutes />
  );
}