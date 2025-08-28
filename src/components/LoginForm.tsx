import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  prefilledUsername?: string;
}

const LoginForm = ({ onSwitchToRegister, prefilledUsername }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: prefilledUsername || '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 当prefilledUsername变化时更新用户名
  useEffect(() => {
    if (prefilledUsername && prefilledUsername.trim()) {
      setFormData(prev => ({ ...prev, username: prefilledUsername.trim() }));
    } else if (prefilledUsername === '') {
      // 如果明确传入空字符串，则清空用户名
      setFormData(prev => ({ ...prev, username: '' }));
    }
  }, [prefilledUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://106.55.236.121:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operate: 'login',
          message: {
            username: formData.username,
            password: formData.password
          }
        })
      });

      const data = await response.json();

      if (data.message.start) {
        // 清除可能存在的旧token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // 存储新token
        localStorage.setItem('token', data.message.token);
        
        // 更新认证上下文
        const isAdmin = data.message.user_info.identity === 'admin';
        login(formData.username, formData.password, isAdmin);
        
        // 导航到首页
        navigate('/');
        
        // 显示成功提示
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">登录成功！欢迎 {data.message.user_info.username}</div>
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
      } else {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">{data.message.cause || '登录失败，请检查用户名或密码'}</div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 origin-left"
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
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">登录失败，请稍后重试</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 origin-left"
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white text-center mb-8">欢迎登录</h2>
      <p className="text-center text-gray-300 mb-8">登录以开启您的 CTF 之旅</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="请输入用户名"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="password"
            placeholder="请输入密码"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white/5"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            <span className="text-gray-300">记住我</span>
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            忘记密码？
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>

        <div className="text-center mt-6">
          <span className="text-gray-400">还没有账号？</span>
          {onSwitchToRegister ? (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 ml-2 transition-colors"
            >
              立即注册
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-400 hover:text-blue-300 ml-2 transition-colors"
            >
              立即注册
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;