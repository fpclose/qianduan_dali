import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

interface User {
  id: number;
  username: string;
  email: string;
  identity: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    username: '',
    email: '',
    identity: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/admin/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'select_users',
          message: {
            page: currentPage,
            limit: 10,
            search_username: searchParams.username || undefined,
            search_email: searchParams.email || undefined,
            search_identity: searchParams.identity || undefined,
            sort_by: 'created_at',
            sort_order: 'DESC'
          }
        })
      });

      const data = await response.json();
      if (data.message.start) {
        setUsers(data.message.users);
        setTotalPages(data.message.total_pages);
      } else {
        throw new Error('获取用户列表失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取用户列表失败</div>
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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchParams]);

  const handleDelete = async (email: string) => {
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="flex flex-col space-y-4">
          <div className="text-white text-lg">确定要删除此用户吗？</div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              取消
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const response = await fetch('http://106.55.236.121:8080/api/admin/user/delete', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      token: localStorage.getItem('token'),
                      operate: 'delete_user',
                      message: { email }
                    })
                  });

                  const data = await response.json();
                  if (data.message.start) {
                    toast.custom((t) => (
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
                        <div className="text-white text-lg mb-3">用户删除成功</div>
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
                    fetchUsers();
                  } else {
                    throw new Error('删除失败');
                  }
                } catch (error) {
                  toast.custom((t) => (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
                      <div className="text-white text-lg mb-3">删除失败，请稍后重试</div>
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
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              确认删除
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
    <div className="h-full flex flex-col border-none rounded-lg">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">用户管理</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              添加用户
            </button>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索用户名"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                value={searchParams.username}
                onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索邮箱"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                value={searchParams.email}
                onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
              />
            </div>
            <select
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              value={searchParams.identity}
              onChange={(e) => setSearchParams({ ...searchParams, identity: e.target.value })}
            >
              <option value="">所有身份</option>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">用户名</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">邮箱</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">身份</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">创建时间</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">更新时间</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="px-6 py-4 text-sm text-white">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-white">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.identity === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {user.identity === 'admin' ? '管理员' : '用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{new Date(user.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-white">{new Date(user.updated_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.email)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-white">
              共 {totalPages} 页
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white flex items-center">第 {currentPage} 页</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchUsers();
          }}
        />
      )}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;