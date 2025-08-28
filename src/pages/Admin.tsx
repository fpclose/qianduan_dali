import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SharedBackground from '../components/SharedBackground';
import { Shield, Users, Settings, Swords, Dumbbell } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import PracticeManagement from '../components/admin/practice/PracticeManagement';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const renderModule = () => {
    switch (activeModule) {
      case 'users':
        return <UserManagement onClose={() => setActiveModule(null)} />;
      case 'practice':
        return <PracticeManagement />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Users Management Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">用户管理</h2>
              </div>
              <p className="text-gray-300 mb-4">管理用户账号、权限和访问控制</p>
              <button 
                onClick={() => setActiveModule('users')}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg transition-colors duration-200"
              >
                查看详情
              </button>
            </div>

            {/* System Settings Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">系统设置</h2>
              </div>
              <p className="text-gray-300 mb-4">配置系统参数和全局设置</p>
              <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg transition-colors duration-200">
                查看详情
              </button>
            </div>

            {/* ISCTF Management Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Swords className="w-6 h-6 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">ISCTF</h2>
              </div>
              <p className="text-gray-300 mb-4">查看和管理 ISCTF 相关信息</p>
              <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg transition-colors duration-200">
                查看详情
              </button>
            </div>

            {/* Practice Area Management Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Dumbbell className="w-6 h-6 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">练习场</h2>
              </div>
              <p className="text-gray-300 mb-4">查看和管理练习场相关内容</p>
              <button 
                onClick={() => setActiveModule('practice')}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg transition-colors duration-200"
              >
                查看详情
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black relative">
        <SharedBackground />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1 pt-20 px-4 pb-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
              {!activeModule && (
                <div className="flex items-center mb-8">
                  <Shield className="w-8 h-8 text-blue-400 mr-3" />
                  <h1 className="text-3xl font-bold text-white">管理面板</h1>
                </div>
              )}

              <div className="h-full">
                {renderModule()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;