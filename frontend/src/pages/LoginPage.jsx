import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState('english'); // 'english' or 'telugu'

  // Language translations
  const translations = {
    english: {
      iAm: 'I am',
      userName: 'User name',
      password: 'Password',
      rememberMe: 'Remember Me',
      logIn: 'Log in',
      forgotPassword: 'Forgot password ?',
      noAccount: 'I do not have an account yet',
      heading: 'Start managing now',
      description: 'Manage your school easily with our free platform.',
      getStarted: 'Get started',
      admin: 'Admin',
      teacher: 'Teacher',
      student: 'Student',
      parent: 'Parent'
    },
    telugu: {
      iAm: 'నేను',
      userName: 'వినియోగదారు పేరు',
      password: 'పాస్‌వర్డ్',
      rememberMe: 'నన్ను గుర్తుంచుకో',
      logIn: 'లాగిన్',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా ?',
      noAccount: 'నాకు ఇంకా ఖాతా లేదు',
      heading: 'ఇప్పుడే నిర్వహణ ప్రారంభించండి',
      description: 'మా ఉచిత ప్లాట్‌ఫారమ్‌తో మీ పాఠశాలను సులభంగా నిర్వహించండి.',
      getStarted: 'ప్రారంభించండి',
      admin: 'అడ్మిన్',
      teacher: 'ఉపాధ్యాయుడు',
      student: 'విద్యార్థి',
      parent: 'తల్లిదండ్రులు'
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const roleOptions = [
    { 
      key: 'admin', 
      label: translations[language].admin, 
      icon: '/src/assets/logincard/admin.png',
      email: 'admin@example.com',
      password: 'admin123'
    },
    { 
      key: 'teacher', 
      label: translations[language].teacher, 
      icon: '/src/assets/logincard/teacher.png',
      email: 'teacher@example.com',
      password: 'teacher123'
    },
    { 
      key: 'student', 
      label: translations[language].student, 
      icon: '/src/assets/logincard/students.png',
      email: 'arjun.sharma@student.com',
      password: 'student123'
    },
    { 
      key: 'parent', 
      label: translations[language].parent, 
      icon: '/src/assets/icons/parents.png',
      email: 'priya.sharma@parent.com',
      password: 'parent123'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.key);
    setEmail(role.email);
    setPassword(role.password);
  };

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Translate Button - Top Left */}
      <button
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(46, 124, 246, 0.1)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
          e.target.style.transform = 'translateY(0)';
        }}
        onClick={() => setLanguage(language === 'telugu' ? 'english' : 'telugu')}
      >
        <img 
          src="/src/assets/icons/translate.png" 
          alt="Translate"
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain'
          }}
        />
      </button>
      
      {/* Left Side - Login Form */}
      <div style={{
        flex: isMobile ? '1' : '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFBFC',
        padding: '40px',
        position: 'relative'
      }}>
        
        {/* Account Question */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          fontSize: '14px',
          color: '#8B8B8B',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>❓</span>
          {translations[language].noAccount}
        </div>

        {/* Login Form Container */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          marginTop: '60px'
        }}>
          
          {/* I am Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              color: '#8B8B8B',
              fontSize: '18px',
              fontWeight: '400',
              marginBottom: '32px',
              letterSpacing: '0.5px'
            }}>
              {translations[language].iAm}
            </h2>
            
            {/* Role Selection Circles */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? '16px' : '20px',
              marginBottom: '48px',
              flexWrap: 'wrap'
            }}>
              {roleOptions.map((role) => (
                <div
                  key={role.key}
                  onClick={() => handleRoleSelect(role)}
                  style={{
                    width: isMobile ? '70px' : '80px',
                    height: isMobile ? '70px' : '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: selectedRole === role.key ? '3px solid #2E7CF6' : '2px solid #E5E7EB',
                    backgroundColor: selectedRole === role.key ? '#2E7CF6' : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    transform: selectedRole === role.key ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedRole === role.key ? 
                      '0 8px 25px rgba(46, 124, 246, 0.3)' : 
                      '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    width: isMobile ? '32px' : '36px',
                    height: isMobile ? '32px' : '36px',
                    borderRadius: '50%',
                    backgroundColor: selectedRole === role.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                    transition: 'background-color 0.3s ease'
                  }}>
                    <img 
                      src={role.icon}
                      alt={role.label}
                      style={{ 
                        width: isMobile ? '24px' : '28px', 
                        height: isMobile ? '24px' : '28px',
                        filter: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  <div style={{ 
                    fontSize: isMobile ? '10px' : '11px', 
                    fontWeight: selectedRole === role.key ? '600' : '500',
                    textAlign: 'center',
                    color: selectedRole === role.key ? 'white' : '#6B7280',
                    transition: 'color 0.3s ease'
                  }}>
                    {role.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit}>
            {/* Username Field */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px'
              }}>
                <img 
                  src="/src/assets/logincard/username.png" 
                  alt="Username"
                  style={{ width: '100%', height: '100%', opacity: 0.6 }}
                />
              </div>
              <input
                placeholder={translations[language].userName}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 50px', 
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2E7CF6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(46, 124, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px'
              }}>
                <img 
                  src="/src/assets/logincard/password.png" 
                  alt="Password"
                  style={{ width: '100%', height: '100%', opacity: 0.6 }}
                />
              </div>
              <input
                placeholder={translations[language].password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 50px', 
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2E7CF6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(46, 124, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ 
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#2E7CF6'
                }}
              />
              <label 
                htmlFor="rememberMe"
                style={{
                  color: '#8B8B8B',
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {translations[language].rememberMe}
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#EF4444', 
                backgroundColor: '#FEF2F2',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'center',
                border: '1px solid #FECACA',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #2E7CF6 0%, #1E5FD9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(46, 124, 246, 0.3)',
                textTransform: 'none',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(46, 124, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(46, 124, 246, 0.3)';
              }}
            >
              {translations[language].logIn}
            </button>
          </form>

          {/* Forgot Password */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <a href="#" style={{
              color: '#8B8B8B',
              fontSize: '14px',
              textDecoration: 'none'
            }}>
              {translations[language].forgotPassword}
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Image and Content (Hidden on Mobile) */}
      {!isMobile && (
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${import.meta.env.VITE_CLOUDINARY_BASE_URL}/c_fill,w_1920,h_1080,q_auto,f_auto/v1760004332/school-platform/login/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          
          {/* Background Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(46, 124, 246, 0.7) 0%, rgba(30, 95, 217, 0.7) 100%)',
            zIndex: 0
          }} />
          
          {/* Content */}
          <div style={{
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '400px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '24px',
              lineHeight: '1.2',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)'
            }}>
              {translations[language].heading}
            </h1>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '40px',
              opacity: 0.95,
              textShadow: '0 1px 10px rgba(0,0,0,0.2)'
            }}>
              {translations[language].description}
            </p>
            
            <button style={{
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textShadow: 'none'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#2E7CF6';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'white';
            }}
            >
              {translations[language].getStarted}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}