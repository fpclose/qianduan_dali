import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddSubcategoryModalProps {
  categoryName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({ 
  categoryName, 
  onClose, 
  onSuccess 
}) => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryName.trim()) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请输入子模块名称</div>
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
      const response = await fetch('http://106.55.236.121:8080/api/challenge/son_add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'title_son_add',
          token: localStorage.getItem('token'),
          message: {
            title: categoryName,
            new_son: subcategoryName.trim()
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">子模块添加成功</div>
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
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">添加子模块</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">所属分类</label>
            <input
              type="text"
              value={categoryName}
              disabled
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">子模块名称</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="请输入子模块名称"
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
              {isLoading ? '添加中...' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;