import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../Utils/api'; // Import the API utils

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await authAPI.login(formData);
      
      if (data) {
        console.log('✅ Login successful:', data);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // ... (keep all your existing styles)
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    card: {
      maxWidth: '400px',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    underline: {
      width: '4rem',
      height: '0.25rem',
      backgroundColor: '#0C3D4A',
      margin: '0 auto',
      borderRadius: '0.125rem'
    },
    errorMessage: {
      marginBottom: '1.5rem',
      padding: '0.75rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      borderRadius: '0.375rem',
      fontSize: '0.875rem'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      position: 'relative'
    },
    inputWrapper: {
      position: 'relative'
    },
    icon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      color: '#9ca3af',
      zIndex: 1,
      pointerEvents: 'none'
    },
    input: {
      display: 'block',
      width: '100%',
      paddingLeft: '2.5rem',
      paddingRight: '0.75rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      border: 'none',
      borderBottom: '2px solid #d1d5db',
      backgroundColor: 'transparent',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      fontSize: '1rem',
      color: '#111827',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      backgroundColor: '#0C3D4A',
      color: 'white',
      fontWeight: '600',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '9999px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '0.5rem'
    },
    buttonDisabled: {
      backgroundColor: '#4a9ba8',
      cursor: 'not-allowed'
    },
    signupContainer: {
      marginTop: '2rem',
      textAlign: 'center'
    },
    signupText: {
      color: '#6b7280'
    },
    signupLink: {
      color: '#0C3D4A',
      fontWeight: '600',
      textDecoration: 'none',
      marginLeft: '0.25rem',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Login</h1>
          <div style={styles.underline}></div>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.formContainer}>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <User style={styles.icon} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={styles.input}
                onFocus={(e) => { e.target.style.borderBottomColor = '#0C3D4A'; }}
                onBlur={(e) => { e.target.style.borderBottomColor = '#d1d5db'; }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <Lock style={styles.icon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={styles.input}
                onFocus={(e) => { e.target.style.borderBottomColor = '#0C3D4A'; }}
                onBlur={(e) => { e.target.style.borderBottomColor = '#d1d5db'; }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div style={styles.signupContainer}>
          <span style={styles.signupText}>Do not have an account? </span>
          <span
            onClick={handleSignUp}
            style={styles.signupLink}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;