import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists on mount and verify it
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Session verification failed. Logged out.", err);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login action
  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ username_or_email: usernameOrEmail, password });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Signup action
  const signup = async (username, email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.signup({ username, email, password, name });
      setLoading(false);
      return user;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Sign up failed. Please try again.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout action
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout request to backend failed, clearing local state anyway.", err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
