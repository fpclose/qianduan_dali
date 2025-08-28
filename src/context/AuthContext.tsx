import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isAdmin: boolean;
  login: (username: string, password: string, isAdmin?: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  isAdmin: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    const token = localStorage.getItem('token');
    
    // 如果没有token，清除认证状态
    if (!token) {
      localStorage.removeItem('auth');
      return {
        isAuthenticated: false,
        username: null,
        isAdmin: false
      };
    }
    
    return savedAuth ? JSON.parse(savedAuth) : {
      isAuthenticated: false,
      username: null,
      isAdmin: false
    };
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const login = (username: string, password: string, isAdmin: boolean = false) => {
    // Development admin account
    if (username === 'admin' && password === '1234') {
      setAuthState({
        isAuthenticated: true,
        username: username,
        isAdmin: true
      });
      return true;
    }

    // Regular login (API response handling)
    setAuthState({
      isAuthenticated: true,
      username: username,
      isAdmin: isAdmin
    });
    return true;
  };

  const logout = () => {
    // 立即清除所有认证相关的数据
    setAuthState({
      isAuthenticated: false,
      username: null,
      isAdmin: false
    });
    
    // 清除localStorage中的所有认证信息
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    
    // 清除sessionStorage中可能存在的认证信息
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('token');
    
    // 导航到首页
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authState.isAuthenticated,
      username: authState.username,
      isAdmin: authState.isAdmin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};