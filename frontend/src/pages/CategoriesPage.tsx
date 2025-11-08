import React, { useState } from 'react';
import { Category } from '../types';
import { useData } from '../hooks/useData';
import { PencilIcon, TrashIcon } from '../constants/icons';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`);
      setCategoryToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (category: Category) => {
    if (category.id) {
      updateCategory(category);
      toast.success(`Kategori "${category.name}" berhasil diperbarui.`);
    } else {
      addCategory(category);
      toast.success(`Kategori "${category.name}" berhasil ditambahkan.`);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Kategori Barang
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none"
        >
          Tambah Kategori
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Induk Kategori</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="text-gray-700">
                  <td className="px-4 py-3 text-sm font-semibold">{cat.name}</td>
                  <td className="px-4 py-3 text-sm">
                    {cat.parentId ? categories.find(p => p.id === cat.parentId)?.name : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Edit">
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-2 text-red-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Delete">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <CategoryFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          category={selectedCategory}
        />
      )}

      {isConfirmOpen && categoryToDelete && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Hapus Kategori"
          message={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete.name}"?`}
        />
      )}
    </>
  );
};

export default CategoriesPage;