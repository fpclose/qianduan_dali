import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddSubcategoryModal from './AddSubcategoryModal';

interface Category {
  id: string;
  name: string;
  subcategories: { [key: string]: string };
}

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (category: string) => void;
  onSubcategorySelect: (subcategory: string) => void;
  onDeleteCategory: (category: string) => void;
  onDeleteSubcategory: (category: string, subcategory: string) => void;
  onRefresh: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  onDeleteCategory,
  onDeleteSubcategory,
  onRefresh
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [addSubCategory, setAddSubCategory] = useState<string>('');

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDeleteCategory = (categoryName: string) => {
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="flex flex-col space-y-4">
          <div className="text-white text-lg">确定要删除 {categoryName} 分类吗？</div>
          <p className="text-gray-300">此操作将删除该分类及其所有子模块。</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                onDeleteCategory(categoryName);
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

  const handleDeleteSubcategory = (categoryName: string, subcategoryName: string) => {
    toast.custom((t) => (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg w-96">
        <div className="flex flex-col space-y-4">
          <div className="text-white text-lg">确定要删除 {subcategoryName} 子模块吗？</div>
          <p className="text-gray-300">此操作将删除该子模块及其所有相关内容。</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                onDeleteSubcategory(categoryName, subcategoryName);
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

  const handleAddSubcategory = (categoryName: string) => {
    setAddSubCategory(categoryName);
    setShowAddSubModal(true);
  };

  return (
    <>
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">练习场分类</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleCategory(category.name);
                      onCategorySelect(category.name);
                    }}
                    className={`flex-1 flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-blue-600 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span>{category.name}</span>
                    {expandedCategories.includes(category.name) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.name)}
                    className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {expandedCategories.includes(category.name) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {Object.entries(category.subcategories).map(([id, name]) => (
                      <div key={id} className="flex items-center justify-between">
                        <button
                          onClick={() => onSubcategorySelect(name)}
                          className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                            selectedSubcategory === name
                              ? 'bg-blue-600/50 text-white'
                              : 'text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {name}
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(category.name, name)}
                          className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddSubcategory(category.name)}
                      className="w-full flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加子模块
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddSubModal && (
        <AddSubcategoryModal
          categoryName={addSubCategory}
          onClose={() => {
            setShowAddSubModal(false);
            setAddSubCategory('');
          }}
          onSuccess={() => {
            setShowAddSubModal(false);
            setAddSubCategory('');
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default Sidebar;