import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ COMPLETE RESET - Fresh configuration
    axios.defaults.baseURL = 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
    
    console.log('🔄 Axios configured for:', axios.defaults.baseURL);
    
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      console.log('🔍 Checking auth status...');
      const response = await axios.get('/auth/me');
      console.log('✅ User found:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.log('❌ No user logged in');
      console.log('🍪 Available cookies:', document.cookie);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };



  const login = async (userData) => {
    try {
      console.log('🟡 Login starting...');
      
      const response = await axios.post('/auth/login', userData);
      console.log('✅ Login success:', response.data);
      
      setTimeout(() => {
        checkUserLoggedIn();
      }, 1000);

      setUser(response.data.user);
      return { success: true };

    } catch (error) {
      console.error('🔴 Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

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
  
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};