import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Handle successful login - redirect or update state
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
    // Add navigation logic here
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

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
    iconContainer: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      zIndex: 1
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
      color: '#111827'
    },
    inputFocus: {
      borderBottomColor: '#0C3D4A'
    },
    placeholder: {
      color: '#9ca3af'
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
      transition: 'background-color 0.2s ease',
      fontSize: '1rem',
      marginTop: '0.5rem'
    },
    buttonHover: {
      backgroundColor: '#0a2f3a'
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
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    signupLinkHover: {
      color: '#0a2f3a',
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Login</h1>
          <div style={styles.underline}></div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <div style={styles.formContainer}>
          {/* Username Field */}
          <div style={styles.inputGroup}>
            <div style={styles.iconContainer}>
              <User size={20} color="#9ca3af" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Username"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#0C3D4A';
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = '#d1d5db';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <div style={styles.iconContainer}>
              <Lock size={20} color="#9ca3af" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#0C3D4A';
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = '#d1d5db';
              }}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#0a2f3a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#0C3D4A';
              }
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Sign Up Link */}
        <div style={styles.signupContainer}>
          <span style={styles.signupText}>Do not have an account? </span>
          <span
            onClick={handleSignUp}
            style={styles.signupLink}
            onMouseEnter={(e) => {
              e.target.style.color = '#0a2f3a';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#0C3D4A';
              e.target.style.textDecoration = 'none';
            }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;