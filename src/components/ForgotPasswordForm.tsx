import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operate: 'reset_password',
          message: {
            email: formData.email,
            request_type: 'get_reset_code'
          }
        })
      });

      const data = await response.json();
      if (data.message === "验证码已发送至您的邮箱" || data.message.includes("验证码将发送到您的邮箱")) {
        setStep('reset');
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
        throw new Error(data.message || '发送失败');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
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

    if (!formData.verificationCode) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请输入验证码！</div>
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
      const response = await fetch('http://106.55.236.121:8080/api/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operate: 'reset_password',
          message: {
            email: formData.email,
            new_password: formData.newPassword,
            verify_code: formData.verificationCode,
            request_type: 'reset_password'
          }
        })
      });

      const data = await response.json();
      if (data.message === "密码重置成功！") {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">密码重置成功！正在跳转到登录页面...</div>
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
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(data.message || '重置失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">密码重置失败，请检查验证码是否正确</div>
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

  const handleBackToEmail = () => {
    setStep('email');
    setFormData({
      ...formData,
      newPassword: '',
      confirmPassword: '',
      verificationCode: ''
    });
  };

  return (
    <div className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/login')}
          className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold text-white">重置密码</h2>
      </div>

      {step === 'email' ? (
        <div>
          <p className="text-center text-gray-300 mb-8">
            请输入您的注册邮箱，我们将发送验证码到您的邮箱
          </p>
          
          <div className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="请输入注册邮箱"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <button
              onClick={requestVerificationCode}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '发送中...' : '发送验证码'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToEmail}
              className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-gray-300">
              验证码已发送至 <span className="text-blue-400">{formData.email}</span>
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="请输入验证码"
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="请输入新密码"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="请确认新密码"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-colors"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '重置中...' : '重置密码'}
            </button>
          </form>
        </div>
      )}

      <div className="text-center mt-6">
        <span className="text-gray-400">想起密码了？</span>
        <button
          onClick={() => navigate('/login')}
          className="text-blue-400 hover:text-blue-300 ml-2 transition-colors"
        >
          返回登录
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;