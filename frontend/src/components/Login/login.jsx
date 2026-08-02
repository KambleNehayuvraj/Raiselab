import React, { useContext, useState } from 'react';
import './login.css';
import { useCart } from '../../context/CartContext'; // Changed from CartContext import

const Login = ({ isOpen, onClose, setShowLogin }) => {
  const { url, login } = useCart(); // Use login instead of setToken
  
  const [formData, setFormData] = useState({
    name: '', // Add name field for registration
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation for registration
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      // Backend expects 8 characters for registration
      newErrors.password = 'Password must be at least 8 characters';
    } else if (isLogin && formData.password.length < 6) {
      // Keep 6 for login for user convenience
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    console.log('🚀 =================================');
    console.log('🚀 Starting authentication request...');
    console.log('📍 Base URL:', url);
    console.log('📍 Full URL:', `${url}/api/user/${isLogin ? 'login' : 'register'}`);
    console.log('📧 Email:', formData.email);
    console.log('👤 Name:', formData.name);
    console.log('🔒 Password length:', formData.password.length);
    console.log('🔄 Mode:', isLogin ? 'LOGIN' : 'REGISTER');
    console.log('🚀 =================================');
    
    try {
      // Check if URL is properly set
      if (!url) {
        throw new Error('Server URL is not configured. Please check your CartContext.');
      }

      const apiUrl = `${url}/api/user/${isLogin ? 'login' : 'register'}`;
      console.log('📡 Making request to:', apiUrl);
      
      // Prepare request body based on login/register mode
      const requestBody = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
      
      console.log('📦 Request body:', requestBody);
      
      // Make API call for login/signup
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📡 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      
      // Get response text first
      const responseText = await response.text();
      console.log('📄 Raw response body:', responseText);
      
      // Check if response is empty
      if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed JSON data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response was not valid JSON:', responseText);
        
        // If it's an HTML response (common with server errors)
        if (responseText.includes('<html>')) {
          throw new Error('Server returned HTML instead of JSON. Check if your server is running properly.');
        }
        
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      // Enhanced response analysis
      console.log('🔍 Response Analysis:');
      console.log('  - Type:', typeof data);
      console.log('  - Keys:', Object.keys(data || {}));
      console.log('  - Success field:', data.success);
      console.log('  - Message field:', data.message);
      console.log('  - Token field:', data.token);
      
      // UPDATED: Use CartContext's login method for proper token handling
      if (data.success === true && data.token) {
        console.log('🎉 Authentication successful!');
        console.log('🔑 Token received:', data.token);
        
        // Prepare user data for storage
        const userData = data.user || data.userData || {
          email: formData.email,
          name: formData.name || null
        };
        
        // Use CartContext's login method which handles token storage and persistence
        login(data.token, userData);
        
        console.log('✅ Token and user data stored via CartContext');
        
        // Close the modal - use both methods for reliability
        if (typeof setShowLogin === 'function') {
          setShowLogin(false);
        }
        if (typeof onClose === 'function') {
          onClose();
        }
        
        // Show success message and clear form
        alert(isLogin ? 'Login successful!' : 'Account created successfully!');
        setFormData({ name: '', email: '', password: '' });
        
        console.log('✅ Login process completed successfully');
        
      } else {
        // Handle error response - backend returned success: false
        const errorMessage = data.message || data.error || 'Authentication failed';
        console.log('❌ Authentication failed:', errorMessage);
        
        // Provide helpful messages for common issues
        let userFriendlyMessage = errorMessage;
        if (errorMessage.toLowerCase().includes("doesn't exit") || errorMessage.toLowerCase().includes("doesn't exist")) {
          userFriendlyMessage = isLogin 
            ? "Account not found. Please check your email or create a new account."
            : errorMessage;
        } else if (errorMessage.toLowerCase().includes("invalid credentials")) {
          userFriendlyMessage = "Invalid email or password. Please try again.";
        } else if (errorMessage.toLowerCase().includes("user already exists")) {
          userFriendlyMessage = "An account with this email already exists. Please try logging in instead.";
        } else if (errorMessage === "Error") {
          userFriendlyMessage = isLogin 
            ? "Login failed. Please check your credentials and try again."
            : "Registration failed. Please check your information and try again.";
        }
        
        setErrors({ general: userFriendlyMessage });
      }
      
    } catch (error) {
      console.error('🔥 =================================');
      console.error('🔥 Authentication Error Details:');
      console.error('🔥 Error type:', error.constructor.name);
      console.error('🔥 Error message:', error.message);
      console.error('🔥 Error stack:', error.stack);
      console.error('🔥 =================================');
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      // Provide specific error messages based on error type
      if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check if the server is running on ' + url;
      } else if (error.message.includes('HTTP')) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message.includes('JSON') || error.message.includes('HTML')) {
        errorMessage = 'Server returned invalid response. Please check server logs.';
      } else if (error.message.includes('Server URL')) {
        errorMessage = 'Server configuration error. Please check your settings.';
      } else {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Debug: Log context values
  React.useEffect(() => {
    console.log('🔧 Context Debug Info:');
    console.log('  - URL from context:', url);
    console.log('  - Current token in localStorage:', localStorage.getItem('token'));
    console.log('  - Current authToken in localStorage:', localStorage.getItem('authToken'));
    console.log('  - Current userData in localStorage:', localStorage.getItem('userData'));
    console.log('  - Context URL type:', typeof url);
    console.log('  - Context URL valid:', !!url);
  }, [url]);

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="login-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Join us today'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {/* Name field for registration */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder={isLogin ? "Enter your password" : "Enter password (min 8 characters)"}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot your password?
              </a>
            </div>
          )}

          <button 
            type="submit" 
            className={`login-submit ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-btn google-btn" disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="login-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} disabled={isLoading}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;