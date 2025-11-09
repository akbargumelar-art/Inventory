
import React, { useState, useMemo } from 'react';
import { Item } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatter';
import ItemFormModal from '../components/items/ItemFormModal';
import ItemDetailModal from '../components/items/ItemDetailModal';
import StockAdjustmentModal from '../components/items/StockAdjustmentModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { PencilIcon, TrashIcon, AdjustmentsIcon } from '../constants/icons';
import toast from 'react-hot-toast';

const getStatusBadge = (status: Item['status']) => {
  switch (status) {
    case 'Aktif':
    case 'Baik':
      return 'text-green-700 bg-green-100';
    case 'Rusak':
      return 'text-yellow-700 bg-yellow-100';
    case 'Non-Aktif':
      return 'text-gray-700 bg-gray-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const ItemsPage: React.FC = () => {
  const { items, categories, updateItem, addItem, deleteItem, adjustItemStock } = useData();
  const { user } = useAuth();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemToAdjust, setItemToAdjust] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const canEdit = user?.role === 'Administrator' || user?.role === 'Input Data';
  const isAdmin = user?.role === 'Administrator';

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, categoryFilter]);

  const handleRowClick = (item: Item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleEditItem = (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleAdjustStock = (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();
    setItemToAdjust(item);
    setIsAdjustModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      toast.success(`Barang "${itemToDelete.name}" berhasil dihapus.`);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveItem = (item: Item) => {
    if (item.id) {
      updateItem(item);
      toast.success(`Barang "${item.name}" berhasil diperbarui.`);
    } else {
      addItem(item);
      toast.success(`Barang "${item.name}" berhasil ditambahkan.`);
    }
    setIsFormModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Daftar Barang
        </h2>
        {canEdit && (
          <button
            onClick={handleAddItem}
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-emerald-600 border border-transparent rounded-lg active:bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:shadow-outline-emerald"
          >
            Tambah Barang
          </button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
            type="text"
            placeholder="Cari berdasarkan nama, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-white border rounded-md focus:border-emerald-400 focus:outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-white border rounded-md focus:border-emerald-400 focus:outline-none"
        >
          <option value="all">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto max-h-[calc(100vh-250px)]">
          <table className="w-full whitespace-no-wrap">
            <thead className="sticky top-0 z-10">
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Harga</th>
                {canEdit && <th className="px-4 py-3">Aksi</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredItems.map((item) => (
                <tr key={item.id} onClick={() => handleRowClick(item)} className="text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <img className="object-cover w-full h-full rounded-full" src={item.media && item.media.length > 0 ? item.media[0].url : `https://ui-avatars.com/api/?name=${item.name.charAt(0)}&color=7F9CF5&background=EBF4FF`} alt="" loading="lazy" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-600">{categories.find(c => c.id === item.categoryId)?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.sku}</td>
                  <td className="px-4 py-3 text-sm">{item.stock} {item.unit}</td>
                   <td className="px-4 py-3 text-xs">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(item.price)}</td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm">
                        <button onClick={(e) => handleAdjustStock(e, item)} className="p-2 text-gray-500 rounded-md hover:bg-gray-200" aria-label="Adjust Stock">
                          <AdjustmentsIcon />
                        </button>
                        <button onClick={(e) => handleEditItem(e, item)} className="p-2 text-gray-500 rounded-md hover:bg-gray-200" aria-label="Edit">
                          <PencilIcon />
                        </button>
                        {isAdmin && (
                          <button onClick={(e) => handleDeleteClick(e, item)} className="p-2 text-red-500 rounded-md hover:bg-gray-200" aria-label="Delete">
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && <ItemFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveItem} item={selectedItem} />}
      {isDetailModalOpen && selectedItem && <ItemDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} item={selectedItem} />}
      {isAdjustModalOpen && itemToAdjust && <StockAdjustmentModal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} item={itemToAdjust} onAdjust={adjustItemStock} />}
      {isConfirmModalOpen && itemToDelete && <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Hapus Barang" message={`Yakin ingin menghapus "${itemToDelete.name}"?`} />}
    </>
  );
};

export default ItemsPage;
