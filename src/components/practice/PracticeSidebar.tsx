import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface Subcategory {
  id: string;
  name: string;
  expanded: boolean;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  expanded: boolean;
}

interface PracticeSidebarProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (category: string) => void;
  onSubcategorySelect: (category: string, subcategory: string) => void;
}

const PracticeSidebar: React.FC<PracticeSidebarProps> = ({
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://106.55.236.121:8080/api/user/challenge/title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token')
        })
      });

      const data = await response.json();
      if (data.result) {
        const categoryList: Category[] = Object.entries(data.message).map(([id, name]) => ({
          id,
          name: name as string,
          subcategories: [],
          expanded: false
        }));
        setCategories(categoryList);
      }
    } catch (error) {
      toast.custom((t) => (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
          <div className="text-white text-lg mb-3">获取分类失败</div>
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
      const response = await fetch('http://106.55.236.121:8080/api/user/challenge/son', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          message: {
            title: categoryName
          }
        })
      });

      const data = await response.json();
      if (data.result && data.message.son_name) {
        const subcategoryList: Subcategory[] = Object.entries(data.message.son_name).map(([id, name]) => ({
          id,
          name: name as string,
          expanded: false
        }));

        setCategories(prev => prev.map(cat => 
          cat.name === categoryName 
            ? { ...cat, subcategories: subcategoryList, expanded: true }
            : cat
        ));
      }
    } catch (error) {
      console.error('获取子分类失败:', error);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    if (!category.expanded && category.subcategories.length === 0) {
      await fetchSubcategories(category.name);
    } else {
      setCategories(prev => prev.map(cat => 
        cat.id === category.id 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      ));
    }
    onCategorySelect(category.name);
  };

  const handleSubcategoryClick = (category: Category, subcategory: Subcategory) => {
    onSubcategorySelect(category.name, subcategory.name);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col">
      {/* Training Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">训练</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="text-white/60 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm">{currentPage}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="text-white/60 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => handleCategoryClick(category)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                {category.subcategories.length > 0 && (
                  category.expanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
                )}
              </button>

              {category.expanded && category.subcategories.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(category, subcategory)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedSubcategory === subcategory.name
                          ? 'bg-blue-600/50 text-white'
                          : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm">{subcategory.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Competition History Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">赛事</h2>
          <div className="flex items-center space-x-2">
            <button className="text-white/60 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm">1</span>
            <button className="text-white/60 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { id: '2024-isctf', name: '2024ISCTF', status: 'active' },
            { id: '2023-isctf', name: '2023ISCTF', status: 'active' },
            { id: '2022-isctf', name: '2022ISCTF', status: 'active' }
          ].map((competition) => (
            <button
              key={competition.id}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-sm">{competition.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeSidebar;