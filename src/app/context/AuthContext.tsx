import React, { createContext, useContext, useState, useEffect } from 'react';
import { Staff, Admin } from '../utils/database';

interface AuthContextType {
  currentUser: (Staff | Admin) | null;
  userType: 'staff' | 'admin' | null;
  login: (user: Staff | Admin, type: 'staff' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(Staff | Admin) | null>(null);
  const [userType, setUserType] = useState<'staff' | 'admin' | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedType = localStorage.getItem('userType');
    if (savedUser && savedType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedType as 'staff' | 'admin');
    }
  }, []);

  const login = (user: Staff | Admin, type: 'staff' | 'admin') => {
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userType,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
