import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import PageTransition from '../components/PageTransition';
import SharedBackground from '../components/SharedBackground';

type AuthMode = 'login' | 'register';

const Auth = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefilledUsername, setPrefilledUsername] = useState('');

  // 根据URL路径设置初始模式
  useEffect(() => {
    if (location.pathname === '/register') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);

  const switchAuthMode = (newMode: AuthMode, username?: string) => {
    if (newMode === authMode || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // 如果提供了用户名，则预填充；如果切换到注册模式，则清空预填充的用户名
    if (username) {
      setPrefilledUsername(username);
    } else if (newMode === 'register') {
      setPrefilledUsername('');
    }
    
    // 淡出动画
    setTimeout(() => {
      setAuthMode(newMode);
      // 淡入动画
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black relative overflow-hidden">
        <SharedBackground />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          
          <main className="flex items-center justify-center min-h-screen px-4 pt-16 pb-12">
            <div className="w-full max-w-4xl">
              {/* Form Container with Animation */}
              <div 
                className={`transition-all duration-300 ease-in-out transform ${
                  isTransitioning 
                    ? 'opacity-0 scale-95 translate-y-4' 
                    : 'opacity-100 scale-100 translate-y-0'
                }`}
              >
                <div className="flex justify-center">
                  {authMode === 'login' ? (
                    <LoginForm 
                      onSwitchToRegister={() => switchAuthMode('register')} 
                      prefilledUsername={prefilledUsername}
                    />
                  ) : (
                    <RegisterForm 
                      onSwitchToLogin={(username) => switchAuthMode('login', username)} 
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth; 