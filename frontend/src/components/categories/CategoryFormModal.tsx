import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { useData } from '../../hooks/useData';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category: Category | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const { categories } = useData();
  const [formData, setFormData] = useState<Partial<Category>>({});
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";


  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ name: '', parentId: null });
    }
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === 'null' ? null : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Category);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">{category ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
             <button type="button" onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500">
                <span className="text-2xl">×</span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Nama Kategori</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Induk Kategori (Opsional)</label>
              <select name="parentId" value={formData.parentId || 'null'} onChange={handleChange} className={commonInputStyle}>
                <option value="null">-- Tidak Ada Induk --</option>
                {categories.filter(c => c.id !== category?.id).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end p-6 border-t rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Tutup</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
