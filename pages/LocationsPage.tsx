
import React, { useState } from 'react';
import { Location } from '../types';
import { useData } from '../hooks/useData';
import { PencilIcon, TrashIcon } from '../constants/icons';
import LocationFormModal from '../components/locations/LocationFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const LocationsPage: React.FC = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  const handleAdd = () => {
    setSelectedLocation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsFormOpen(true);
  };

  const handleDelete = (location: Location) => {
    setLocationToDelete(location);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete.id);
      toast.success(`Lokasi "${locationToDelete.name}" berhasil dihapus.`);
      setLocationToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (location: Location) => {
    if (location.id) {
      updateLocation(location);
      toast.success(`Lokasi "${location.name}" berhasil diperbarui.`);
    } else {
      addLocation(location);
      toast.success(`Lokasi "${location.name}" berhasil ditambahkan.`);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Manajemen Lokasi
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none"
        >
          Tambah Lokasi
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3">Nama Lokasi</th>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {locations.map((loc) => (
                <tr key={loc.id} className="text-gray-700">
                  <td className="px-4 py-3 text-sm font-semibold">{loc.name}</td>
                  <td className="px-4 py-3 text-sm">{loc.code}</td>
                  <td className="px-4 py-3 text-sm">{loc.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <button onClick={() => handleEdit(loc)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Edit">
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleDelete(loc)} className="p-2 text-red-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Delete">
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
        <LocationFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          location={selectedLocation}
        />
      )}

      {isConfirmOpen && locationToDelete && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Hapus Lokasi"
          message={`Apakah Anda yakin ingin menghapus lokasi "${locationToDelete.name}"?`}
        />
      )}
    </>
  );
};

export default LocationsPage;