
import React, { useState } from 'react';
import { User } from '../types';
import { useData } from '../hooks/useData';
import { PencilIcon, TrashIcon } from '../constants/icons';
import UserFormModal from '../components/users/UserFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      toast.success(`Pengguna "${userToDelete.name}" berhasil dihapus.`);
      setUserToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (user: User) => {
    if (user.id) {
      updateUser(user);
      toast.success(`Pengguna "${user.name}" berhasil diperbarui.`);
    } else {
      addUser(user);
      toast.success(`Pengguna "${user.name}" berhasil ditambahkan.`);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Manajemen Pengguna
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none"
        >
          Tambah Pengguna
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {users.map((user) => (
                <tr key={user.id} className="text-gray-700">
                  <td className="px-4 py-3 text-sm font-semibold">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <button onClick={() => handleEdit(user)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Edit">
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-2 text-red-500 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="Delete">
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
        <UserFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          user={selectedUser}
        />
      )}

      {isConfirmOpen && userToDelete && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Hapus Pengguna"
          message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete.name}"?`}
        />
      )}
    </>
  );
};

export default UsersPage;