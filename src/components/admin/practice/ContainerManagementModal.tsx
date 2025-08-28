import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Square, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Container {
  id: number;
  challenge_name: string;
  title: string;
  title_son: string;
  username: string;
  flag: string;
  start_time: string;
  end_time: string;
  container_url: string;
  container_state: boolean;
}

interface ContainerManagementModalProps {
  onClose: () => void;
}

const ContainerManagementModal: React.FC<ContainerManagementModalProps> = ({ onClose }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContainers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'dynamic_container_select'
        })
      });

      const data = await response.json();
      if (data.result && data.message) {
        const containerList = Object.values(data.message) as Container[];
        setContainers(containerList);
      } else {
        setContainers([]);
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取容器列表失败</div>
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

  const handleStopContainer = async (container: Container) => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/reduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'dynamic_container_reduce',
          message: {
            title: container.title,
            title_son: container.title_son,
            challenge_name: container.challenge_name
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">容器已停止</div>
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
        fetchContainers();
      } else {
        throw new Error('停止失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">容器停止失败</div>
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
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">动态容器管理</h3>
          <div className="flex space-x-2">
            <button
              onClick={fetchContainers}
              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : containers.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">🐳</div>
            <h3 className="text-xl font-semibold mb-2">暂无运行中的容器</h3>
            <p>当前没有活跃的动态容器</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">题目名称</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">容器地址</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">启动时间</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">结束时间</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">操作</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr key={container.id} className="border-b border-white/10">
                    <td className="px-4 py-4 text-sm text-white">{container.challenge_name}</td>
                    <td className="px-4 py-4 text-sm text-white">
                      {container.title} / {container.title_son}
                    </td>
                    <td className="px-4 py-4 text-sm text-white">{container.username}</td>
                    <td className="px-4 py-4 text-sm text-white">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{container.container_url}</span>
                        <button
                          onClick={() => window.open(`http://${container.container_url}`, '_blank')}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-white">
                      {new Date(container.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-white">
                      {new Date(container.end_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        container.container_state 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {container.container_state ? '运行中' : '已停止'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {container.container_state && (
                        <button
                          onClick={() => handleStopContainer(container)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="停止容器"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerManagementModal;