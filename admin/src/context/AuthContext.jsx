import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
