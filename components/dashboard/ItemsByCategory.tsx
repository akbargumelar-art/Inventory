
import React from 'react';
import { Item, Category } from '../../types';
import { CategoryIcon } from '../../constants/icons';

interface ItemsByCategoryProps {
  items: Item[];
  categories: Category[];
}

const ItemsByCategory: React.FC<ItemsByCategoryProps> = ({ items, categories }) => {
  const itemsCount = categories.map(category => ({
    ...category,
    count: items.filter(item => item.categoryId === category.id).length,
  }));

  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs">
      <h4 className="mb-4 font-semibold text-gray-800">
        Barang per Kategori
      </h4>
      <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
        {itemsCount.map(cat => (
          <li key={cat.id} className="py-3 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                 <CategoryIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {cat.name}
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {cat.count} Barang
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsByCategory;