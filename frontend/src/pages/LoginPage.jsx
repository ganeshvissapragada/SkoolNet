import React, { useContext, useState } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState('priya.sharma@parent.com');
  const [password, setPassword] = useState('parent123');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.role, res.data.userId);
      if (res.data.role === 'admin') nav('/admin');
      else if (res.data.role === 'teacher') nav('/teacher');
      else if (res.data.role === 'parent') nav('/parent');
      else nav('/student');
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#2c3e50',
          fontSize: '28px'
        }}>
          🏫 School Login
        </h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '10px',
                border: '2px solid #e1e8ed',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '10px',
                border: '2px solid #e1e8ed',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          {error && (
            <div style={{ 
              color: '#e74c3c', 
              backgroundColor: '#fee',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '1px solid #fcc'
            }}>
              ❌ {error}
            </div>
          )}
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              padding: '15px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Login
          </button>
        </form>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Test Accounts:</h4>
          <div style={{ marginBottom: '8px' }}>
            <strong>Parent:</strong> priya.sharma@parent.com / parent123
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Student:</strong> arjun.sharma@student.com / student123
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Teacher:</strong> teacher@example.com / teacher123
          </div>
          <div>
            <strong>Admin:</strong> admin@example.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}