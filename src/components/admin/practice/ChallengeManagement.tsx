import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, Edit, Trash2, Play, Square, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import AddChallengeModal from './AddChallengeModal';
import EditChallengeModal from './EditChallengeModal';
import ChallengeDetailModal from './ChallengeDetailModal';
import ContainerManagementModal from './ContainerManagementModal';

interface Challenge {
  id: string;
  challenge_name: string;
  state: 'show' | 'hide';
}

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

interface ChallengeManagementProps {
  category: string;
  subcategory: string;
  onBack: () => void;
}

const ChallengeManagement: React.FC<ChallengeManagementProps> = ({
  category,
  subcategory,
  onBack
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContainerModal, setShowContainerModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challengeDetail, setChallengeDetail] = useState<ChallengeDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'show' | 'hide'>('all');

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/information/select_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'challenge_information_select_1',
          message: {
            title: category,
            son: subcategory
          }
        })
      });

      const data = await response.json();
      if (data.result && data.message.change_information) {
        const challengeList = Object.entries(data.message.change_information).map(([id, info]: [string, any]) => ({
          id,
          challenge_name: info.challenge_name,
          state: info.state
        }));
        setChallenges(challengeList);
      } else {
        setChallenges([]);
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取题目列表失败</div>
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

  const fetchChallengeDetail = async (challengeName: string) => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/information/select_2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'challenge_information_select_2',
          message: {
            title: category,
            son: subcategory,
            challenge_name: challengeName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        setChallengeDetail(data.message);
      }
    } catch (error) {
      console.error('获取题目详情失败:', error);
    }
  };

  const handleDeleteChallenge = async (challengeName: string) => {
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="flex flex-col space-y-4">
          <div className="text-white text-lg">确定要删除题目 "{challengeName}" 吗？</div>
          <p className="text-gray-300">此操作将永久删除该题目及其所有相关数据。</p>
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
                  const response = await fetch('http://106.55.236.121:8080/api/challenge/reduce', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      token: localStorage.getItem('token'),
                      operate: 'challenge_reduce',
                      message: {
                        title: category,
                        son: subcategory,
                        challenge_name: challengeName
                      }
                    })
                  });

                  const data = await response.json();
                  if (data.result) {
                    toast.custom((t) => (
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
                        <div className="text-white text-lg mb-3">题目删除成功</div>
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
                    fetchChallenges();
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

  const handleToggleStatus = async (challengeName: string, currentState: 'show' | 'hide') => {
    const newState = currentState === 'show' ? 'hide' : 'show';
    try {
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
            change_information_new: {
              new_state: newState
            }
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">
              题目状态已更新为{newState === 'show' ? '显示' : '隐藏'}
            </div>
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
        fetchChallenges();
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">状态更新失败</div>
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

  const handleViewDetail = async (challengeName: string) => {
    setSelectedChallenge(challengeName);
    await fetchChallengeDetail(challengeName);
    setShowDetailModal(true);
  };

  const handleEditChallenge = async (challengeName: string) => {
    setSelectedChallenge(challengeName);
    await fetchChallengeDetail(challengeName);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchChallenges();
  }, [category, subcategory]);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.challenge_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.state === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{subcategory}</h2>
            <p className="text-gray-400">{category} 分类</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowContainerModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Clock className="w-5 h-5 mr-2" />
            容器管理
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加题目
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-6 border-b border-white/10">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索题目名称..."
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'show' | 'hide')}
        >
          <option value="all">全部状态</option>
          <option value="show">显示</option>
          <option value="hide">隐藏</option>
        </select>
      </div>

      {/* Challenge List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredChallenges.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">暂无题目</h3>
            <p>点击"添加题目"按钮创建第一个题目</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {challenge.challenge_name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    challenge.state === 'show' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {challenge.state === 'show' ? '显示' : '隐藏'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetail(challenge.challenge_name)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditChallenge(challenge.challenge_name)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="编辑题目"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChallenge(challenge.challenge_name)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="删除题目"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(challenge.challenge_name, challenge.state)}
                    className={`p-2 transition-colors ${
                      challenge.state === 'show'
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-green-400 hover:text-green-300'
                    }`}
                    title={challenge.state === 'show' ? '隐藏题目' : '显示题目'}
                  >
                    {challenge.state === 'show' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddChallengeModal
          category={category}
          subcategory={subcategory}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchChallenges();
          }}
        />
      )}

      {showEditModal && selectedChallenge && challengeDetail && (
        <EditChallengeModal
          category={category}
          subcategory={subcategory}
          challengeName={selectedChallenge}
          challengeDetail={challengeDetail}
          onClose={() => {
            setShowEditModal(false);
            setSelectedChallenge(null);
            setChallengeDetail(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedChallenge(null);
            setChallengeDetail(null);
            fetchChallenges();
          }}
        />
      )}

      {showDetailModal && selectedChallenge && challengeDetail && (
        <ChallengeDetailModal
          challengeName={selectedChallenge}
          challengeDetail={challengeDetail}
          category={category}
          subcategory={subcategory}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedChallenge(null);
            setChallengeDetail(null);
          }}
        />
      )}

      {showContainerModal && (
        <ContainerManagementModal
          onClose={() => setShowContainerModal(false)}
        />
      )}
    </div>
  );
};

export default ChallengeManagement;