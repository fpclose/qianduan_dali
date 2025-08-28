import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import ModuleContent from './ModuleContent';
import ChallengeManagement from './ChallengeManagement';
import AddCategoryModal from './AddCategoryModal';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  subcategories: { [key: string]: string };
}

const PracticeManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'modules' | 'challenges'>('modules');
  const [challengeContext, setChallengeContext] = useState<{category: string, subcategory: string} | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'title_select',
          token: localStorage.getItem('token')
        })
      });

      const data = await response.json();
      if (data.result) {
        const categoryList: Category[] = Object.entries(data.message).map(([id, name]) => ({
          id,
          name: name as string,
          subcategories: {}
        }));
        setCategories(categoryList);
      } else {
        throw new Error('获取分类失败');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取分类失败，请稍后重试</div>
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

  const fetchSubcategories = async (categoryName: string) => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/son', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'title_son',
          token: localStorage.getItem('token'),
          message: {
            title: categoryName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        setCategories(prev => prev.map(cat => 
          cat.name === categoryName 
            ? { ...cat, subcategories: data.message.son_name || {} }
            : cat
        ));
      }
    } catch (error) {
      console.error('获取子分类失败:', error);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory(null);
    setViewMode('modules');
    fetchSubcategories(categoryName);
  };

  const handleViewChallenges = (category: string, subcategory: string) => {
    setChallengeContext({ category, subcategory });
    setViewMode('challenges');
  };

  const handleBackToModules = () => {
    setViewMode('modules');
    setChallengeContext(null);
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/title_reduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'title_reduce',
          token: localStorage.getItem('token'),
          message: {
            title: categoryName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">分类删除成功</div>
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
        fetchCategories();
        if (selectedCategory === categoryName) {
          setSelectedCategory(null);
          setSelectedSubcategory(null);
        }
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
  };

  const handleDeleteSubcategory = async (categoryName: string, subcategoryName: string) => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/challenge/son_reduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operate: 'title_son_reduce',
          token: localStorage.getItem('token'),
          message: {
            title: categoryName,
            son: subcategoryName
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        toast.custom((t) => (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
            <div className="text-white text-lg mb-3">子模块删除成功</div>
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
        fetchSubcategories(categoryName);
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
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full bg-gradient-to-b from-blue-900 to-black items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (viewMode === 'challenges' && challengeContext) {
    return (
      <ChallengeManagement
        category={challengeContext.category}
        subcategory={challengeContext.subcategory}
        onBack={handleBackToModules}
      />
    );
  }

  return (
    <div className="flex h-full bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
      <Sidebar 
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={setSelectedSubcategory}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubcategory={handleDeleteSubcategory}
        onRefresh={fetchCategories}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory || '练习场管理'}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加分类
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <ModuleContent 
            category={selectedCategory}
            subcategory={selectedSubcategory}
            categories={categories}
            onDeleteSubcategory={handleDeleteSubcategory}
            onRefreshSubcategories={fetchSubcategories}
            onViewChallenges={handleViewChallenges}
          />
        </div>
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
};

export default PracticeManagement;