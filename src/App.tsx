import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

// Lazy load other pages
const Auth = React.lazy(() => import('./pages/Auth'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Practice = React.lazy(() => import('./pages/Practice'));
const ISCTF = React.lazy(() => import('./pages/ISCTF'));
const Community = React.lazy(() => import('./pages/Community'));
const Competitions = React.lazy(() => import('./pages/Competitions'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/isctf" element={<ISCTF />} />
          <Route path="/community" element={<Community />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;