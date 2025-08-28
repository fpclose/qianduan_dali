import React, { useState, useRef, useEffect } from 'react';
import { Bell, Shield, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar = () => {
  const { isAuthenticated, username, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="flex flex-col space-y-4">
          <div className="text-white text-lg">确定要退出登录吗？</div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                
                // 立即执行登出操作
                logout();
                
                // 显示成功提示
                toast.custom((t) => (
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
                    <div className="text-white text-lg mb-3">退出登录成功</div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 origin-left"
                        style={{ 
                          animation: 'progress 3s linear forwards',
                          width: '0%'
                        }}
                      />
                    </div>
                  </div>
                ), {
                  duration: 3000,
                  position: 'bottom-right',
                });
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              确认退出
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'bottom-right',
    });
  };

  return (
    <nav className="fixed top-0 w-full backdrop-blur-md bg-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-200">
              大理大学CTF终端
            </a>
          </div>
          
          <div className="hidden md:flex flex-1 justify-between items-center">
            <div className="flex space-x-8 ml-10">
              <a href="/" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300">首页</a>
              <a href="/practice" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300">练习场</a>
              <a href="/isctf" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300">ISCTF</a>
              <a href="/community" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300">社区</a>
              <a href="/competitions" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300">其他赛事</a>
              {isAdmin && (
                <a href="/admin" className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-300 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  管理面板
                </a>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-white hover:text-blue-300 transition-colors duration-200">
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleAuthClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                >
                  {isAuthenticated ? username : '登录'}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
                    <div className="py-1">
                      <button
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        个人设置
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;