import React, { useState } from 'react';
import { Item, StockHistory } from '../../types';
import toast from 'react-hot-toast';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdjust: (itemId: string, quantityChange: number, type: StockHistory['type'], reason: string) => void;
  item: Item;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ isOpen, onClose, onAdjust, item }) => {
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>('decrease');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<StockHistory['type']>('Dijual');

  const reasonOptions: { [key in 'increase' | 'decrease']: StockHistory['type'][] } = {
    // Fix: Add more reason options for adjustments
    increase: ['Penerimaan', 'Koreksi', 'Retur', 'Dikembalikan'],
    decrease: ['Dijual', 'Hilang', 'Diberikan', 'Koreksi', 'Penjualan', 'Dipinjamkan'],
  };
  
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";
  const labelStyle = "block text-sm font-medium text-gray-700";

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReason(e.target.value as StockHistory['type']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityChange = adjustmentType === 'increase' ? quantity : -quantity;
    onAdjust(item.id, quantityChange, reason, `Penyesuaian manual: ${reason}`);
    toast.success(`Stok ${item.name} berhasil disesuaikan.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Penyesuaian Stok: {item.name}</h3>
            <button type="button" onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500"><span className="text-2xl">×</span></button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-700">Stok saat ini: <span className="font-bold">{item.stock} {item.unit}</span></p>
            <div>
              <label className={labelStyle}>Tipe Penyesuaian</label>
              <div className="flex mt-1">
                <button type="button" onClick={() => { setAdjustmentType('decrease'); setReason('Dijual'); }} className={`px-4 py-2 text-sm rounded-l-md ${adjustmentType === 'decrease' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Kurangi Stok</button>
                <button type="button" onClick={() => { setAdjustmentType('increase'); setReason('Penerimaan'); }} className={`px-4 py-2 text-sm rounded-r-md ${adjustmentType === 'increase' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Tambah Stok</button>
              </div>
            </div>
            <div>
              <label className={labelStyle}>Jumlah</label>
              <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" required className={commonInputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Alasan</label>
              <select value={reason} onChange={handleReasonChange} required className={commonInputStyle}>
                {reasonOptions[adjustmentType].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
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

export default StockAdjustmentModal;