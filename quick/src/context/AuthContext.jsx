import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      // ✅ 401 error is normal when no user is logged in
      if (error.response?.status === 401) {
        console.log('No user logged in (401) - This is normal');
      } else {
        console.error('Error checking auth:', error.response?.data || error.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 // Register user with better error handling
const register = async (userData) => {
  try {
    console.log('Registering user:', userData);
    const response = await axios.post('/auth/register', userData);
    setUser(response.data.user);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('🔴 Registration error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    let errorMessage = 'Registration failed';
    
    // ✅ Get actual error message from backend
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 400) {
      errorMessage = 'Bad request - check your input data';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error - check backend console';
    }
    
    return { 
      success: false, 
      message: errorMessage,
      status: error.response?.status
    };
  }
};

  // Login user
  const login = async (userData) => {
    try {
      const response = await axios.post('/auth/login', userData);
      setUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};