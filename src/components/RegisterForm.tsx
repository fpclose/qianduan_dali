import React, { useState, useEffect } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSwitchToLogin?: (username?: string) => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const requestVerificationCode = async () => {
    if (!formData.email) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请输入邮箱地址！</div>
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
      return;
    }

    // 如果正在倒计时，不允许重复发送
    if (countdown > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operate: 'register',
          message: {
            email: formData.email,
            request_type: 'get_verify_code'
          }
        })
      });

      const data = await response.json();
      if (data.message === "验证码已发送至您的邮箱") {
        setShowVerificationInput(true);
        setCountdown(60); // 开始60秒倒计时
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">验证码已发送至您的邮箱</div>
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
        // 处理获取验证码失败的情况
        let errorMessage = "验证码发送失败，请稍后重试";
        
        // 根据后端返回的错误信息设置相应的提示
        if (data.message && typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message && data.message.cause) {
          errorMessage = data.message.cause;
        }
        
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">{errorMessage}</div>
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
          duration: 4000,
          position: 'bottom-right',
        });
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">验证码发送失败，请稍后重试</div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">两次输入的密码不一致！</div>
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
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operate: 'register',
          message: {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            verify_code: formData.verificationCode,
            request_type: 'register'
          }
        })
      });

      const data = await response.json();
      if (data.message.info === "注册成功！") {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">注册成功！欢迎 {formData.username}</div>
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

        setTimeout(() => {
          if (onSwitchToLogin) {
            onSwitchToLogin(formData.username);
          } else {
            navigate('/login');
          }
        }, 3000);
      } else {
        // 处理注册失败的情况
        let errorMessage = "注册失败，请稍后重试";
        
        // 根据后端返回的错误信息设置相应的提示
        if (data.message && data.message.cause) {
          errorMessage = data.message.cause;
        } else if (data.message && typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        // 特殊处理验证码相关错误
        if (errorMessage.includes('验证码') || errorMessage.includes('验证') || 
            errorMessage.includes('code') || errorMessage.includes('verify')) {
          errorMessage = "验证码不正确，请重新输入";
        }
        
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">{errorMessage}</div>
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
          duration: 4000,
          position: 'bottom-right',
        });
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">注册失败，请稍后重试</div>
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
    <div className="w-full max-w-4xl p-8 backdrop-blur-lg bg-white/10 rounded-lg shadow-xl">
      <div className="space-y-3 mb-12">
        <h2 className="text-4xl font-bold text-white text-center">欢迎注册</h2>
        <p className="text-center text-xl text-blue-300">开启您的 CTF 之旅</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* First row: Username and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">用户名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-blue-400" />
              <input
                type="text"
                placeholder="请输入用户名"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">邮箱地址</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-blue-400" />
              <input
                type="email"
                placeholder="请输入邮箱地址"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Second row: Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-blue-400" />
              <input
                type="password"
                placeholder="请输入密码"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">确认密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-blue-400" />
              <input
                type="password"
                placeholder="请再次输入密码"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Verification Code Section */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={requestVerificationCode}
            disabled={isLoading || countdown > 0}
            className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
              countdown > 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading 
              ? '发送中...' 
              : countdown > 0 
                ? `重新发送 (${countdown}s)` 
                : '获取验证码'
            }
          </button>

          {showVerificationInput && (
            <input
              type="text"
              placeholder="请输入验证码"
              className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all"
              value={formData.verificationCode}
              onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
              required
            />
          )}
        </div>

        <div className="flex flex-col items-center space-y-6 mt-12">
          <button
            type="submit"
            disabled={isLoading || !showVerificationInput}
            className="w-full md:w-1/3 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '注册中...' : '注册'}
          </button>

          <div className="text-center">
            <span className="text-gray-400">已有账号？</span>
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={() => onSwitchToLogin(formData.username.trim() || undefined)}
                className="text-blue-400 hover:text-blue-300 ml-2 transition-colors font-medium"
              >
                立即登录
              </button>
            ) : (
              <a href="/login" className="text-blue-400 hover:text-blue-300 ml-2 transition-colors font-medium">
                立即登录
              </a>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;