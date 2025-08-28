import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import PageTransition from '../components/PageTransition';
import SharedBackground from '../components/SharedBackground';

const Login = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black relative overflow-hidden">
        <SharedBackground />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          
          <main className="flex items-center justify-center min-h-screen px-4 pt-16 pb-12">
            <LoginForm />
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;