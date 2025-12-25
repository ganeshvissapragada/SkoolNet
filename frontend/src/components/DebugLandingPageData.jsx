import React, { useState, useEffect } from 'react';
import api from './api/api.js';

const DebugLandingPageData = () => {
  const [publicData, setPublicData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Test public API
      console.log('Fetching public data...');
      const publicResponse = await api.get('/api/public/landing-page-data');
      setPublicData(publicResponse.data);
      console.log('Public data:', publicResponse.data);

      // Test admin API (requires authentication)
      try {
        console.log('Fetching admin data...');
        const adminResponse = await api.get('/api/admin/landing-page');
        setAdminData(adminResponse.data);
        console.log('Admin data:', adminResponse.data);
      } catch (adminError) {
        console.log('Admin API error (expected if not logged in):', adminError.response?.status);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔍 Landing Page Data Debug</h2>
      
      <button onClick={fetchData} style={{ marginBottom: '20px', padding: '10px' }}>
        Refresh Data
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Public API Data (/api/public/landing-page-data)</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {publicData ? JSON.stringify(publicData, null, 2) : 'Loading...'}
          </pre>
        </div>

        <div>
          <h3>Admin API Data (/api/admin/landing-page)</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {adminData ? JSON.stringify(adminData, null, 2) : 'Not authenticated or loading...'}
          </pre>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Comparison</h3>
        <p>
          Data should be identical between public and admin APIs.
          {publicData && adminData && JSON.stringify(publicData) === JSON.stringify(adminData) 
            ? '✅ Data matches!' 
            : '❌ Data differs or one is missing'}
        </p>
      </div>
    </div>
  );
};

export default DebugLandingPageData;
