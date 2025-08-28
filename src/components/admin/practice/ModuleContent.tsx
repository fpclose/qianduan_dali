import React from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  subcategories: { [key: string]: string };
}

interface ModuleContentProps {
  category: string | null;
  subcategory: string | null;
  categories: Category[];
  onDeleteSubcategory: (category: string, subcategory: string) => void;
  onRefreshSubcategories: (category: string) => void;
  onViewChallenges: (category: string, subcategory: string) => void;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ 
  category, 
  subcategory, 
  categories,
  onDeleteSubcategory,
  onRefreshSubcategories,
  onViewChallenges
}) => {
  if (!category) {
    return (
      <div className="text-center text-gray-400 mt-20">
        请从左侧选择一个分类
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.name === category);
  if (!selectedCategory) {
    return (
      <div className="text-center text-gray-400 mt-20">
        分类不存在
      </div>
    );
  }

  const subcategories = Object.entries(selectedCategory.subcategories);
  const filteredSubcategories = subcategory 
    ? subcategories.filter(([_, name]) => name === subcategory)
    : subcategories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSubcategories.map(([id, name]) => (
        <div
          key={id}
          className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <button 
              onClick={() => onDeleteSubcategory(category, name)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">题目数量: 0</span>
            <button 
              onClick={() => onViewChallenges(category, name)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="查看题目"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {!subcategory && (
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center cursor-pointer">
          <Plus className="w-8 h-8 text-blue-400" />
        </div>
      )}
    </div>
  );
};

export default ModuleContent;