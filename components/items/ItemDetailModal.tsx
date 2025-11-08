
import React from 'react';
import { Item } from '../../types';
import { useData } from '../../hooks/useData';
import { formatCurrency, formatDate } from '../../utils/formatter';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, item }) => {
  const { categories, locations } = useData();

  if (!isOpen) return null;

  const category = categories.find(c => c.id === item.categoryId)?.name || 'N/A';
  const location = locations.find(l => l.id === item.defaultLocationId)?.name || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-2xl mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <button onClick={onClose} type="button" className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500">
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
          {item.media && item.media.length > 0 && (
            <div className="mb-4">
              {item.media.map(mediaFile => (
                <div key={mediaFile.id} className="mb-2">
                  {mediaFile.type === 'image' ? (
                    <img src={mediaFile.url} alt={mediaFile.name} className="object-contain w-full max-h-64 rounded-lg" />
                  ) : (
                    <video controls src={mediaFile.url} className="object-contain w-full max-h-64 rounded-lg bg-black">
                      Browser Anda tidak mendukung tag video.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-semibold text-gray-500">SKU</div>
            <div>{item.sku}</div>

            <div className="font-semibold text-gray-500">Barcode</div>
            <div>{item.barcode}</div>

            <div className="font-semibold text-gray-500">Kategori</div>
            <div>{category}</div>
            
            <div className="font-semibold text-gray-500">Lokasi</div>
            <div>{location}</div>

            <div className="font-semibold text-gray-500">Stok</div>
            <div>{item.stock} / <span className="text-xs">min. {item.minStock}</span> {item.unit}</div>

            <div className="font-semibold text-gray-500">Harga</div>
            <div>{formatCurrency(item.price)}</div>

            <div className="font-semibold text-gray-500">Status</div>
            <div>
                <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${item.active ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'}`}>
                    {item.active ? 'Aktif' : 'Non-Aktif'}
                </span>
            </div>

            <div className="font-semibold text-gray-500">Dibuat pada</div>
            <div>{formatDate(item.createdAt)}</div>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold text-gray-500 text-sm">Deskripsi</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{item.description}</p>
          </div>

        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none">Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;