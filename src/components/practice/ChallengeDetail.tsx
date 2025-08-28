import React, { useState, useEffect, useRef } from 'react';
import { Download, Play, Square, ExternalLink, Flag, Clock, Users, AlertCircle, Timer, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Challenge {
  id: number;
  name: string;
  solved: boolean;
  solves: number;
}

interface ChallengeInfo {
  challenge_name: string;
  information: {
    describe: string | null;
    hit: string | null;
    appendix: string | null;
    challenge_success_number: number;
    history: boolean;
    docker?: string | null;
  };
  title: string;
  title_son: string;
}

interface ContainerInfo {
  title: string;
  title_son: string;
  challenge_name: string;
  start_time: string;
  end_time: string;
  container_url: string;
}

interface ChallengeDetailProps {
  category: string;
  subcategory: string;
  challenge: Challenge;
  onBack?: () => void;
}

const ChallengeDetail: React.FC<ChallengeDetailProps> = ({
  category,
  subcategory,
  challenge,
  onBack
}) => {
  const [challengeInfo, setChallengeInfo] = useState<ChallengeInfo | null>(null);
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingContainer, setIsStartingContainer] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isDynamic, setIsDynamic] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // 使用 useRef 来管理定时器，避免状态更新导致的重复创建
  const containerCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeCountdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingContainerRef = useRef(false);

  const fetchChallengeDetail = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      console.log('Fetching challenge detail for:', { category, subcategory, challengeName: challenge.name });
      
      const response = await fetch('http://106.55.236.121:8080/api/user/challenge/information', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challenge.name
          }
        })
      });

      const data = await response.json();
      console.log('Challenge detail response:', data);
      
      if (data.result && data.message && data.message.information) {
        setChallengeInfo(data.message);
        
        const dockerField = data.message.information.docker;
        console.log('Docker field from API:', dockerField);
        
        if (dockerField && dockerField.trim() !== '') {
          console.log('Dynamic challenge detected - docker:', dockerField);
          setIsDynamic(true);
          // 初始检查容器状态
          await checkExistingContainer(); // <--- 修改为此行
        } else {
          console.log('Static challenge detected - no docker or empty docker');
          setIsDynamic(false);
        }
        
      } else {
        console.error('API returned error or no data:', data);
        const errorMessage = data.message?.cause || '题目不存在或无权访问';
        setApiError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('获取题目详情失败:', error);
      const errorMessage = error instanceof Error ? error.message : '获取题目详情失败';
      setApiError(errorMessage);
      
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取题目详情失败</div>
          <div className="text-gray-300 text-sm mb-3">{errorMessage}</div>
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
        duration: 5000,
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingContainer = async () => {
    // 防止重复检查
    if (isCheckingContainerRef.current) {
      console.log('Container check already in progress, skipping...');
      return;
    }

    isCheckingContainerRef.current = true;
    
    try {
      console.log(`Checking user container status with new API for: ${challenge.name}`);
      
      // 使用新的 API 地址和 operate 参数
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'user_container_status'
        })
      });

      const data = await response.json();
      console.log('User container status response:', data);
      
      // 采用全新的、更简单的逻辑来处理新API的返回结果
      if (data.result === true && data.message) {
        // 如果API返回成功，且返回的容器是当前页面的这个题目，则更新UI
        if (data.message.challenge_name === challenge.name) {
          console.log('Found active container for this specific challenge:', data.message);
          setContainerInfo(data.message);
        } else {
          // 如果用户有正在运行的容器，但不是当前题目的，则同样视作无容器
          console.log(`User has a container for another challenge ('${data.message.challenge_name}'), but not this one.`);
          setContainerInfo(null);
        }
      } else {
        // 如果API返回 result: false，说明用户没有任何正在运行的容器
        console.log('No active container found for this user.');
        setContainerInfo(null);
      }
    } catch (error) {
      console.error('检查现有容器失败:', error);
    } finally {
      isCheckingContainerRef.current = false;
    }
  };

  const handleStartContainer = async () => {
    if (isDynamic === false) {
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
      console.log('Starting container for:', { category, subcategory, challengeName: challenge.name });
      
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'dynamic_container_add',
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challenge.name
          }
        })
      });

      const data = await response.json();
      console.log('Container start response:', data);
      
      if (data.result && data.message) {
        const containerData = {
          title: data.message.title || category,
          title_son: data.message.title_son || subcategory,
          challenge_name: data.message.challenge_name || challenge.name,
          start_time: data.message.start_time,
          end_time: data.message.end_time,
          container_url: data.message.container_url
        };
        
        setContainerInfo(containerData);
        console.log('Container started successfully:', containerData);
        
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">容器启动成功！</div>
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
        
        // 启动成功后开始状态检查（延迟启动，避免立即冲突）
        setTimeout(() => {
          startContainerStatusCheck();
        }, 2000);
      } else {
        throw new Error(data.message || '容器启动失败');
      }
    } catch (error) {
      console.error('Container start error:', error);
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">容器启动失败，请稍后重试</div>
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
      console.log('Stopping container for:', { category, subcategory, challengeName: challenge.name });
      
      const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/reduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          operate: 'dynamic_container_reduce',
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challenge.name
          }
        })
      });

      const data = await response.json();
      console.log('Container stop response:', data);
      
      if (data.result) {
        setContainerInfo(null);
        stopContainerStatusCheck();
        
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
      } else {
        throw new Error(data.message || '容器停止失败');
      }
    } catch (error) {
      console.error('Container stop error:', error);
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

  const handleExtendTime = async () => {
  try {
    console.log('Extending container time');

    const response = await fetch('http://106.55.236.121:8080/api/dynamic/container/time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        operate: 'user_container_time',
      }),
    });

    const data = await response.json();
    console.log('Container extend response:', data);

    if (data.result && data.message) {
      // 修改：直接使用后端返回的新信息更新状态
      setContainerInfo((prevInfo) => {
        if (!prevInfo) return null; // 安全检查：如果之前的状态没了，就不更新

        // 使用新数据覆盖旧数据，确保 end_time 等信息是最新
        const updatedInfo = { ...prevInfo, ...data.message };
        console.log('容器信息在延长后被更新:', updatedInfo);
        return updatedInfo;
      });

      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">容器时间延长成功！</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 origin-left"
              style={{ animation: 'progress 3s linear forwards', width: '0%' }}
            />
          </div>
        </div>
      ), {
        duration: 3000,
        position: 'bottom-right',
      });
    } else {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">{data.cause || '延时失败'}</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 origin-left"
              style={{ animation: 'progress 3s linear forwards', width: '0%' }}
            />
          </div>
        </div>
      ), {
        duration: 3000,
        position: 'bottom-right',
      });
    }
  } catch (error) {
    console.error('Container extend error:', error);
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="text-white text-lg mb-3">延时失败，请稍后重试</div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 origin-left"
            style={{ animation: 'progress 3s linear forwards', width: '0%' }}
          />
        </div>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
  }
};


  const handleSubmitFlag = async () => {
    if (!flagInput.trim()) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">请输入Flag</div>
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

    setIsSubmittingFlag(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/user/challenge/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          message: {
            title: category,
            title_son: subcategory,
            challenge_name: challenge.name,
            flag: flagInput.trim()
          }
        })
      });

      const data = await response.json();
      
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">🎉 {data.cause}</div>
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
        setFlagInput('');
        // 重新获取题目信息以更新解题状态
        fetchChallengeDetail();
      } else {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">{data.cause}</div>
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
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">提交失败，请稍后重试</div>
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
      setIsSubmittingFlag(false);
    }
  };

  // 启动容器状态检查 - 使用更长的间隔，减少API调用频率
  const startContainerStatusCheck = () => {
    console.log('Starting container status check');
    stopContainerStatusCheck(); // 先清除现有的定时器
    
    // 使用60秒的检查间隔，减少对服务器的压力
    containerCheckIntervalRef.current = setInterval(() => {
      console.log('Periodic container check (60s interval)');
      checkExistingContainer();
    }, 60000);
  };

  // 停止容器状态检查
  const stopContainerStatusCheck = () => {
    if (containerCheckIntervalRef.current) {
      console.log('Stopping container status check');
      clearInterval(containerCheckIntervalRef.current);
      containerCheckIntervalRef.current = null;
    }
  };

  // 启动时间倒计时
  const startTimeCountdown = () => {
    if (timeCountdownIntervalRef.current) {
      clearInterval(timeCountdownIntervalRef.current);
    }

    timeCountdownIntervalRef.current = setInterval(() => {
      if (containerInfo?.end_time) {
        // 检查从API获取的时间字符串是否已经包含 'Z' (标准UTC格式)
        const endTimeString = containerInfo.end_time.endsWith('Z')
          ? containerInfo.end_time      // 如果已包含 'Z'，直接使用
          : containerInfo.end_time + 'Z'; // 如果不包含，则手动添加 'Z'

        // 使用我们处理过的、能确保被正确解析为UTC时间的字符串
        const endTime = new Date(endTimeString).getTime();
        const now = new Date().getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeRemaining('00:00:00');
          console.log('Container time expired, clearing container info');
          setContainerInfo(null);
          stopContainerStatusCheck();
          if (timeCountdownIntervalRef.current) {
            clearInterval(timeCountdownIntervalRef.current);
            timeCountdownIntervalRef.current = null;
          }
        }
      }
    }, 1000);
  };

  // 停止时间倒计时
  const stopTimeCountdown = () => {
    if (timeCountdownIntervalRef.current) {
      clearInterval(timeCountdownIntervalRef.current);
      timeCountdownIntervalRef.current = null;
    }
  };

  // // 初始化时检查容器状态
  // useEffect(() => {
  //   if (challenge && isDynamic === true) {
  //     console.log('Challenge or dynamic status changed, checking containers');
  //     // 延迟检查，避免与其他初始化冲突
  //     const timeoutId = setTimeout(() => {
  //       checkExistingContainer();
  //     }, 1000);
      
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [category, subcategory, challenge.name, isDynamic]);

  // 管理容器状态检查
  useEffect(() => {
    if (containerInfo && isDynamic === true) {
      console.log('Container info available, starting status check');
      startContainerStatusCheck();
      startTimeCountdown();
    } else {
      console.log('No container info, stopping status check');
      stopContainerStatusCheck();
      stopTimeCountdown();
    }
    
    return () => {
      stopContainerStatusCheck();
      stopTimeCountdown();
    };
  }, [containerInfo, isDynamic]);

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up timers');
      stopContainerStatusCheck();
      stopTimeCountdown();
    };
  }, []);

  useEffect(() => {
    if (challenge) {
      console.log('Challenge changed, fetching details:', challenge);
      fetchChallengeDetail();
    }
  }, [category, subcategory, challenge]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!challengeInfo || apiError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">题目加载失败</h2>
          <p className="text-gray-400 mb-4">{apiError || '请稍后重试或联系管理员'}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回题目列表
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Challenge Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{challenge.name}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {challengeInfo.information.challenge_success_number} solves
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {challengeInfo.information.history ? '已解决' : '未解决'}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  isDynamic === true ? 'bg-green-500/20 text-green-400' : 
                  isDynamic === false ? 'bg-blue-500/20 text-blue-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {isDynamic === true ? '动态题目' : 
                   isDynamic === false ? '静态题目' : 
                   '检测中...'}
                </span>
                {challengeInfo.information.history && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    ✓ 已完成
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {challengeInfo.information.describe && (
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">题目描述</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {challengeInfo.information.describe}
                </div>
              </div>
            )}

            {/* Hints */}
            {challengeInfo.information.hit && (
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">提示</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {challengeInfo.information.hit}
                </div>
              </div>
            )}

            {/* Attachments */}
            {challengeInfo.information.appendix && (
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">附件</h3>
                <button onClick={() => window.open(challengeInfo.information.appendix, '_blank')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  下载附件
                </button>
              </div>
            )}

            {/* Dynamic Container */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">题目环境</h3>
              
              {containerInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">容器地址</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-mono bg-black/20 px-3 py-1 rounded">
                          {containerInfo.container_url}
                        </p>
                        <button
                          onClick={() => window.open(`http://${containerInfo.container_url}`, '_blank')}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">剩余时间</p>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-yellow-400" />
                        <p className="text-white font-mono">{timeRemaining}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleStopContainer}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      停止容器
                    </button>
                    <button
                      onClick={handleExtendTime}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      延长30分钟
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isDynamic === false ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">这是一道静态题目，无需启动容器环境</span>
                    </div>
                  ) : isDynamic === true ? (
                    <button
                      onClick={handleStartContainer}
                      disabled={isStartingContainer}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isStartingContainer ? '启动中...' : '启动容器'}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-300">正在检测题目类型...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Flag Submission */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                提交Flag
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setFlagInput(flagInput + 'dalictf{')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    dalictf{'{'}
                  </button>
                  <button 
                    onClick={() => setFlagInput(flagInput + '}')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    {'}'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="请输入Flag"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitFlag()}
                />
                <button
                  onClick={handleSubmitFlag}
                  disabled={isSubmittingFlag}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmittingFlag ? '提交中...' : '提交'}
                </button>
              </div>
            </div>

            {/* Challenge Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">题目信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">分类</span>
                  <span className="text-white">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">子分类</span>
                  <span className="text-white">{subcategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">题目类型</span>
                  <span className={`${
                    isDynamic === true ? 'text-green-400' : 
                    isDynamic === false ? 'text-blue-400' : 
                    'text-gray-400'
                  }`}>
                    {isDynamic === true ? '动态题目' : 
                     isDynamic === false ? '静态题目' : 
                     '检测中...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">解题人数</span>
                  <span className="text-white">{challengeInfo.information.challenge_success_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">状态</span>
                  <span className={`${challengeInfo.information.history ? 'text-green-400' : 'text-gray-400'}`}>
                    {challengeInfo.information.history ? '已解决' : '未解决'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
