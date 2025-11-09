
import React, { useState } from 'react';
import { Borrowing } from '../../types';
import { useData } from '../../hooks/useData';

interface BorrowingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Use Partial<Borrowing> to align with the data sent on save.
  onSave: (borrowing: Partial<Borrowing>) => void;
}

const BorrowingFormModal: React.FC<BorrowingFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const { items } = useData();
  const availableItems = items.filter(i => (i.status === 'Aktif' || i.status === 'Baik') && i.stock > 0);
  const [formData, setFormData] = useState({
    itemId: availableItems[0]?.id || '',
    borrowerName: '',
    borrowDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    notes: '',
  });
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId) {
        alert("Pilih barang yang akan dipinjam.");
        return;
    }
    onSave({
        ...formData,
        borrowDate: new Date(formData.borrowDate).toISOString(),
        expectedReturnDate: new Date(formData.expectedReturnDate).toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Catat Peminjaman Baru</h3>
            <button type="button" onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500"><span className="text-2xl">×</span></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Barang yang Dipinjam</label>
              <select name="itemId" value={formData.itemId} onChange={handleChange} required className={commonInputStyle}>
                <option value="">-- Pilih Barang --</option>
                {availableItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name} (Stok: {item.stock})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nama Peminjam</label>
              <input type="text" name="borrowerName" value={formData.borrowerName} onChange={handleChange} required className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Tanggal Pinjam</label>
              <input type="date" name="borrowDate" value={formData.borrowDate} onChange={handleChange} required className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Tgl Perkiraan Kembali</label>
              <input type="date" name="expectedReturnDate" value={formData.expectedReturnDate} onChange={handleChange} required className={commonInputStyle} />
            </div>
             <div>
              <label className="block text-sm text-gray-700">Catatan</label>
              {/* Fix: Ensure value is not undefined */}
              <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className={commonInputStyle}></textarea>
            </div>
          </div>
          <div className="flex items-center justify-end p-6 border-t rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowingFormModal;