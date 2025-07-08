import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const authStatus = localStorage.getItem('racing-server-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    // Simple password check - you can change this password
    if (password === 'test') {
      setIsAuthenticated(true);
      // eslint-disable-next-line no-undef
      localStorage.setItem('racing-server-auth', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    // eslint-disable-next-line no-undef
    localStorage.removeItem('racing-server-auth');
  };

  // Development helper - force refresh context state
  const refreshContext = () => {
    setIsLoading(true);
    // eslint-disable-next-line no-undef
    const authStatus = localStorage.getItem('racing-server-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    // Only expose refreshContext in development
    ...(process.env.NODE_ENV === 'development' && { refreshContext }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 