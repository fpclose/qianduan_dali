import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Play, CheckCircle, Circle, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Challenge {
  id: number;
  name: string;
  solved: boolean;
  solves: number;
}

interface ChallengeListPageProps {
  category: string;
  subcategory: string;
  onBack: () => void;
  onChallengeSelect: (challenge: Challenge) => void;
}

const ChallengeListPage: React.FC<ChallengeListPageProps> = ({
  category,
  subcategory,
  onBack,
  onChallengeSelect
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSolved, setFilterSolved] = useState<'all' | 'solved' | 'unsolved'>('all');

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/user/challenge/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          message: {
            title: category,
            title_son: subcategory
          }
        })
      });

      const data = await response.json();
      console.log('Challenge list response:', data);
      
      if (data.result && data.challenges) {
        setChallenges(data.challenges);
      } else {
        setChallenges([]);
        console.log('No challenges found or API error:', data);
      }
    } catch (error) {
      console.error('Fetch challenges error:', error);
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

  useEffect(() => {
    fetchChallenges();
  }, [category, subcategory]);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSolved === 'all' || 
                         (filterSolved === 'solved' && challenge.solved) ||
                         (filterSolved === 'unsolved' && !challenge.solved);
    return matchesSearch && matchesFilter;
  });

  const solvedCount = challenges.filter(c => c.solved).length;
  const totalCount = challenges.length;

  const handleChallengeClick = (challenge: Challenge) => {
    console.log('Challenge clicked:', challenge);
    onChallengeSelect(challenge);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
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
            <h1 className="text-2xl font-bold text-white">{subcategory}</h1>
            <p className="text-gray-400">{category} 分类</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
            已解决: {solvedCount}
          </span>
          <span className="flex items-center">
            <Circle className="w-4 h-4 mr-1" />
            总计: {totalCount}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-6 border-b border-white/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索题目..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            value={filterSolved}
            onChange={(e) => setFilterSolved(e.target.value as 'all' | 'solved' | 'unsolved')}
          >
            <option value="all">全部题目</option>
            <option value="solved">已解决</option>
            <option value="unsolved">未解决</option>
          </select>
        </div>
      </div>

      {/* Challenge List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredChallenges.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">暂无题目</h3>
            <p>该分类下暂时没有可用的题目</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => handleChallengeClick(challenge)}
                className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      challenge.solved ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {challenge.name}
                    </h3>
                  </div>
                  {challenge.solved && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.solves} solves
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {challenge.solved ? '已完成' : '未解决'}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {challenge.solved && (
                  <div className="mt-3 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs text-center">
                    ✓ 已解决
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeListPage;