import React, { useState, useEffect } from 'react';
import { X, Play, Square, ExternalLink } from 'lucide-react';
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

interface ContainerInfo {
  title: string;
  title_son: string;
  challenge_name: string;
  start_time: string;
  end_time: string;
  container_url: string;
}

interface ChallengeDetailModalProps {
  challengeName: string;
  challengeDetail: ChallengeDetail;
  category: string;
  subcategory: string;
  onClose: () => void;
}

const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({
  challengeName,
  challengeDetail,
  category,
  subcategory,
  onClose
}) => {
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [isStartingContainer, setIsStartingContainer] = useState(false);

  const checkExistingContainer = async () => {
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
        // 查找当前题目的运行中容器
        const containers = Object.values(data.message) as any[];
        const currentContainer = containers.find(container => 
          container.title === category &&
          container.title_son === subcategory &&
          container.challenge_name === challengeName &&
          container.container_state === true
        );

        if (currentContainer) {
          setContainerInfo({
            title: currentContainer.title,
            title_son: currentContainer.title_son,
            challenge_name: currentContainer.challenge_name,
            start_time: currentContainer.start_time,
            end_time: currentContainer.end_time,
            container_url: currentContainer.container_url
          });
        } else {
          setContainerInfo(null);
        }
      }
    } catch (error) {
      console.error('检查现有容器失败:', error);
    }
  };

  const handleStartContainer = async () => {
    if (!challengeDetail.change_information.docker) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">此题目不支持动态容器</div>
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

    setIsStartingContainer(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'dynamic_container_add',
          token: localStorage.getItem('token'),
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challengeName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        setContainerInfo(data.message);
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">容器启动成功</div>
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
        throw new Error('容器启动失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">容器启动失败</div>
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
      setIsStartingContainer(false);
    }
  };

  const handleStopContainer = async () => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/reduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'dynamic_container_reduce',
          token: localStorage.getItem('token'),
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challengeName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        setContainerInfo(null);
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

  // 组件加载时检查现有容器
  useEffect(() => {
    if (challengeDetail.change_information.docker) {
      checkExistingContainer();
    }
  }, [challengeName, category, subcategory]);

  // 定期检查容器状态
  useEffect(() => {
    if (challengeDetail.change_information.docker) {
      const interval = setInterval(() => {
        checkExistingContainer();
      }, 30000); // 每30秒检查一次

      return () => clearInterval(interval);
    }
  }, [challengeName, category, subcategory]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">题目详情: {challengeName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">题目状态</h4>
              <span className={`px-3 py-1 rounded-full text-sm ${
                challengeDetail.change_information.state === 'show' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {challengeDetail.change_information.state === 'show' ? '显示' : '隐藏'}
              </span>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">题目类型</h4>
              <p className="text-white">
                {challengeDetail.change_information.docker ? '动态题目' : '静态题目'}
              </p>
            </div>
          </div>

          {/* Description */}
          {challengeDetail.change_information.describe && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">题目描述</h4>
              <p className="text-white whitespace-pre-wrap">
                {challengeDetail.change_information.describe}
              </p>
            </div>
          )}

          {/* Hint */}
          {challengeDetail.change_information.hit && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">题目提示</h4>
              <p className="text-white whitespace-pre-wrap">
                {challengeDetail.change_information.hit}
              </p>
            </div>
          )}

          {/* Appendix */}
          {challengeDetail.change_information.appendix && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">题目附件</h4>
              <p className="text-white">{challengeDetail.change_information.appendix}</p>
            </div>
          )}

          {/* Docker Info */}
          {challengeDetail.change_information.docker && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Docker信息</h4>
              <div className="space-y-2">
                <p className="text-white">
                  <span className="text-gray-400">镜像名:</span> {challengeDetail.change_information.docker}
                </p>
                {challengeDetail.change_information.docker_number && (
                  <p className="text-white">
                    <span className="text-gray-400">暴露端口:</span> {challengeDetail.change_information.docker_number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Static Flag */}
          {challengeDetail.change_information.static_flag && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">静态Flag</h4>
              <p className="text-white font-mono bg-black/20 p-2 rounded">
                {challengeDetail.change_information.static_flag}
              </p>
            </div>
          )}

          {/* Container Management */}
          {challengeDetail.change_information.docker && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-4">容器管理</h4>
              
              {containerInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">容器地址</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-mono">{containerInfo.container_url}</p>
                        <button
                          onClick={() => window.open(`http://${containerInfo.container_url}`, '_blank')}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">运行时间</p>
                      <p className="text-white">{containerInfo.start_time} - {containerInfo.end_time}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleStopContainer}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    停止容器
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartContainer}
                  disabled={isStartingContainer}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isStartingContainer ? '启动中...' : '启动容器'}
                </button>
              )}
            </div>
          )}
        </div>

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

export default ChallengeDetailModal;