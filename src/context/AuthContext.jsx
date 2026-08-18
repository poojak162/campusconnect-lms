import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    // Keep user state in sync with localStorage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = (email, password) => {
    const sessionUser = authService.login(email, password);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isStudent = role === 'student';
  const isFaculty = role === 'faculty';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        isAuthenticated, 
        isStudent, 
        isFaculty, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
