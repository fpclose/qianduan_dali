import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddChallengeModalProps {
  category: string;
  subcategory: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddChallengeModal: React.FC<AddChallengeModalProps> = ({
  category,
  subcategory,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    challenge_name: '',
    docker: '',
    docker_number: '',
    describe: '',
    hit: '',
    appendix: '',
    state: 'show' as 'show' | 'hide',
    static_flag: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.challenge_name.trim()) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请输入题目名称</div>
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

    // Validate that either docker or static_flag is provided
    if (!formData.docker.trim() && !formData.static_flag.trim()) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请填写Docker镜像名或静态Flag</div>
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
      const response = await fetch('http://106.55.236.121:8080/api/challenge/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'challenge_add',
          message: {
            title: category,
            son: subcategory,
            challenge_name: formData.challenge_name.trim(),
            change_information: {
              docker: formData.docker.trim() || null,
              docker_number: formData.docker_number.trim() || null,
              describe: formData.describe.trim() || null,
              hit: formData.hit.trim() || null,
              appendix: formData.appendix.trim() || null,
              state: formData.state,
              static_flag: formData.static_flag.trim() || null
            }
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">题目添加成功</div>
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
        onSuccess();
      } else {
        throw new Error('添加失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">添加失败，请稍后重试</div>
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">添加新题目</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">题目名称 *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                value={formData.challenge_name}
                onChange={(e) => setFormData({ ...formData, challenge_name: e.target.value })}
                placeholder="请输入题目名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">状态</label>
              <select
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value as 'show' | 'hide' })}
              >
                <option value="show">显示</option>
                <option value="hide">隐藏</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Docker镜像名</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                value={formData.docker}
                onChange={(e) => setFormData({ ...formData, docker: e.target.value })}
                placeholder="动态题目的Docker镜像名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">暴露端口</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                value={formData.docker_number}
                onChange={(e) => setFormData({ ...formData, docker_number: e.target.value })}
                placeholder="如: 80, 8080"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">静态Flag</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={formData.static_flag}
              onChange={(e) => setFormData({ ...formData, static_flag: e.target.value })}
              placeholder="静态题目的Flag值"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">题目描述</label>
            <textarea
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              rows={4}
              value={formData.describe}
              onChange={(e) => setFormData({ ...formData, describe: e.target.value })}
              placeholder="请输入题目描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">题目提示</label>
            <textarea
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              rows={3}
              value={formData.hit}
              onChange={(e) => setFormData({ ...formData, hit: e.target.value })}
              placeholder="请输入题目提示（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">题目附件</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={formData.appendix}
              onChange={(e) => setFormData({ ...formData, appendix: e.target.value })}
              placeholder="附件文件名或链接（可选）"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '添加中...' : '添加题目'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChallengeModal;