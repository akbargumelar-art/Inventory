import React, { useState, useEffect } from 'react';
import { Item, Media } from '../../types';
import { useData } from '../../hooks/useData';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  item: Item | null;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const { categories, locations } = useData();
  const [formData, setFormData] = useState<Partial<Item>>({});
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        defaultLocationId: locations[0]?.id || '',
        unit: 'pcs',
        stock: 0,
        minStock: 10,
        price: 0,
        currency: 'IDR',
        active: true,
        media: [],
      });
    }
  }, [item, isOpen, categories, locations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          setMediaFiles(Array.from(e.target.files));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload files here and get URLs
    const newMedia: Media[] = mediaFiles.map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        url: URL.createObjectURL(file), // Temporary URL for preview
        type: file.type.startsWith('image') ? 'image' : 'video',
        name: file.name
    }));
    
    onSave({ ...formData, media: [...(formData.media || []), ...newMedia] } as Item);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-2xl mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">{item ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
            <button onClick={onClose} type="button" className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500">
              <span className="text-2xl">×</span>
            </button>
          </div>
          <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Nama Barang</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={commonInputStyle} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Kategori</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={commonInputStyle}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Lokasi Default</label>
                <select name="defaultLocationId" value={formData.defaultLocationId} onChange={handleChange} className={commonInputStyle}>
                  {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Stok Saat Ini</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={commonInputStyle} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Minimal Stok</label>
                <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} className={commonInputStyle} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Harga Perkiraan</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={commonInputStyle} />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Satuan</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className={commonInputStyle}>
                  <option value="pcs">Pcs</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="meter">Meter</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={commonInputStyle}></textarea>
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Foto/Video</label>
                <input type="file" multiple onChange={handleMediaChange} accept="image/*,video/*" className="block w-full mt-1 text-sm" />
              </div>
              <div className="mt-4 text-sm">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="text-emerald-600 form-checkbox focus:border-emerald-400 focus:outline-none focus:shadow-outline-emerald" />
                  <span className="ml-2">Barang Aktif</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none">Tutup</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;