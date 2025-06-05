import React, { useState } from 'react';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleLogin = () => {
    console.log('Navigate to login');
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
    formCard: {
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
    inputFocused: {
      borderBottomColor: '#0C3D4A'
    },
    placeholder: {
      color: '#9ca3af'
    },
    submitButton: {
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
    submitButtonHover: {
      backgroundColor: '#0a2f3a'
    },
    footer: {
      marginTop: '2rem',
      textAlign: 'center'
    },
    footerText: {
      color: '#6b7280'
    },
    loginLink: {
      color: '#0C3D4A',
      fontWeight: '600',
      textDecoration: 'none',
      marginLeft: '0.25rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    loginLinkHover: {
      color: '#0a2f3a',
      textDecoration: 'underline'
    }
  };


  const UserIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const EmailIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );

  const LockIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Sign Up</h1>
          <div style={styles.underline}></div>
        </div>
        
        {/* Sign Up Form */}
        <div style={styles.formContainer}>
          {/* Name Field */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <UserIcon />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#0C3D4A';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = '#d1d5db';
                }}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <EmailIcon />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#0C3D4A';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = '#d1d5db';
                }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <LockIcon />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#0C3D4A';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = '#d1d5db';
                }}
                required
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0a2f3a';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#0C3D4A';
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account </span>
          <span
            onClick={handleLogin}
            style={styles.loginLink}
            onMouseEnter={(e) => {
              e.target.style.color = '#0a2f3a';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#0C3D4A';
              e.target.style.textDecoration = 'none';
            }}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;