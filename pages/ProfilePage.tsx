
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Password baru tidak cocok!');
      return;
    }

    const updatedData: Partial<User> = { ...formData };
    if (newPassword) {
      updatedData.password = newPassword;
    }
    
    try {
      await updateProfile(updatedData as User);
      toast.success('Profil berhasil diperbarui!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const err = error as Error;
      toast.error(`Gagal memperbarui profil: ${err.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!currentUser) {
    return (
        <h2 className="my-6 text-2xl font-semibold text-gray-700">
            Memuat data pengguna...
        </h2>
    );
  }

  return (
    <>
      <h2 className="my-6 text-2xl font-semibold text-gray-700">
        Edit Profil Saya
      </h2>

      <div className="px-4 py-5 mb-8 bg-white rounded-lg shadow-md">
         <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label className="block text-sm">
                        <span className="text-gray-700">Nama Lengkap</span>
                        <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className={commonInputStyle}
                        required
                        />
                    </label>
                 </div>
                 <div>
                    <label className="block text-sm">
                        <span className="text-gray-700">Alamat Email</span>
                        <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className={commonInputStyle}
                        required
                        />
                    </label>
                 </div>
                 <div>
                    <label className="block text-sm">
                        <span className="text-gray-700">Role</span>
                        <input
                        type="text"
                        name="role"
                        value={formData.role || ''}
                        disabled
                        className={`${commonInputStyle} bg-gray-100 cursor-not-allowed`}
                        />
                    </label>
                 </div>

                 <hr className="my-4" />

                 <div>
                    <h3 className="text-lg font-medium text-gray-800">Ubah Password</h3>
                    <p className="text-sm text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>
                 </div>

                <div>
                    <label className="block text-sm">
                        <span className="text-gray-700">Password Baru</span>
                        <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={commonInputStyle}
                        />
                    </label>
                </div>
                 <div>
                    <label className="block text-sm">
                        <span className="text-gray-700">Konfirmasi Password Baru</span>
                        <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={commonInputStyle}
                        />
                    </label>
                </div>
            </div>
            
            <div className="mt-6">
                <button type="submit" className="px-5 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-emerald-600 border border-transparent rounded-lg active:bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:shadow-outline-emerald">
                    Simpan Perubahan
                </button>
            </div>
         </form>
      </div>
    </>
  );
};

export default ProfilePage;
