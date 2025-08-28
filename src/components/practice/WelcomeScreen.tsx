import React from 'react';
import { Dumbbell, Target, Trophy, Users } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Dumbbell className="w-24 h-24 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">欢迎来到练习场！</h1>
          <p className="text-xl text-gray-300 mb-8">
            练习场中的题目均为有时间限制，可以无限次重试，请放心大胆去尝试！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">技能提升</h3>
            <p className="text-gray-300">
              通过练习不同类型的CTF题目，提升你的网络安全技能和解题能力。
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">挑战自我</h3>
            <p className="text-gray-300">
              从基础到进阶，循序渐进地挑战各种难度的题目，不断突破自己的极限。
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">社区交流</h3>
            <p className="text-gray-300">
              与其他选手交流解题思路，分享经验，共同进步。
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">祝你好运！</h2>
          <p className="text-gray-300 mb-6">
            希望本练习场能够为你带来技术上的进步！ :)
          </p>
          <div className="text-sm text-gray-400">
            <p>另外练习场中不存在排行榜以及大屏。</p>
            <p>题目是有意义的，请好好珍惜！</p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;