import React, { useState, useEffect } from 'react';
import { Location } from '../../types';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  location: Location | null;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({ isOpen, onClose, onSave, location }) => {
  const [formData, setFormData] = useState<Partial<Location>>({});
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({ name: '', code: '', address: '', description: '' });
    }
  }, [location, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Location);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">{location ? 'Edit Lokasi' : 'Tambah Lokasi'}</h3>
            <button type="button" onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-500">
                <span className="text-2xl">×</span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Nama Lokasi</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Kode</label>
              <input type="text" name="code" value={formData.code || ''} onChange={handleChange} required className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Alamat</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className={commonInputStyle} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Deskripsi</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className={commonInputStyle}></textarea>
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

export default LocationFormModal;
