import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeDetail {
  challenge_name: string;
  change_information: {
    docker: string | null;
    describe: string | null;
    hit: string | null;
    appendix: string | null;
    state: 'show' | 'hide';
    static_flag: string | null;
    docker_number?: string;
  };
}

interface EditChallengeModalProps {
  category: string;
  subcategory: string;
  challengeName: string;
  challengeDetail: ChallengeDetail;
  onClose: () => void;
  onSuccess: () => void;
}

const EditChallengeModal: React.FC<EditChallengeModalProps> = ({
  category,
  subcategory,
  challengeName,
  challengeDetail,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    docker: challengeDetail.change_information.docker || '',
    docker_number: challengeDetail.change_information.docker_number || '',
    describe: challengeDetail.change_information.describe || '',
    hit: challengeDetail.change_information.hit || '',
    appendix: challengeDetail.change_information.appendix || '',
    state: challengeDetail.change_information.state,
    static_flag: challengeDetail.change_information.static_flag || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Build the update object with only changed fields
      const updateData: any = {};
      
      if (formData.docker !== (challengeDetail.change_information.docker || '')) {
        updateData.new_docker = formData.docker.trim() || null;
      }
      if (formData.describe !== (challengeDetail.change_information.describe || '')) {
        updateData.new_describe = formData.describe.trim() || null;
      }
      if (formData.hit !== (challengeDetail.change_information.hit || '')) {
        updateData.new_hit = formData.hit.trim() || null;
      }
      if (formData.appendix !== (challengeDetail.change_information.appendix || '')) {
        updateData.new_appendix = formData.appendix.trim() || null;
      }
      if (formData.state !== challengeDetail.change_information.state) {
        updateData.new_state = formData.state;
      }
      if (formData.static_flag !== (challengeDetail.change_information.static_flag || '')) {
        updateData.new_static_flag = formData.static_flag.trim() || null;
      }

      const response = await fetch('http://106.55.236.121:8080/api/challenge/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'challenge_change',
          message: {
            title: category,
            son: subcategory,
            challenge_name: challengeName,
            change_information_new: updateData
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">题目修改成功</div>
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
        throw new Error('修改失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">修改失败，请稍后重试</div>
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
          <h3 className="text-xl font-semibold text-white">编辑题目: {challengeName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {isLoading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChallengeModal;