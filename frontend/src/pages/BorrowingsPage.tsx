
import React, { useState } from 'react';
import { Borrowing } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatter';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BorrowingFormModal from '../components/borrowing/BorrowingFormModal';


const BorrowingsPage: React.FC = () => {
    const { borrowings, items, returnBorrowing, addBorrowing } = useData();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [borrowingToReturn, setBorrowingToReturn] = useState<Borrowing | null>(null);

    const canEdit = user?.role === 'Administrator' || user?.role === 'Input Data';

    const handleReturnClick = (borrowing: Borrowing) => {
        setBorrowingToReturn(borrowing);
        setIsConfirmOpen(true);
    };

    const confirmReturn = () => {
        if (borrowingToReturn) {
            returnBorrowing(borrowingToReturn.id);
            toast.success(`Barang telah ditandai sebagai 'Kembali'.`);
            setBorrowingToReturn(null);
            setIsConfirmOpen(false);
        }
    };

    // Fix: Changed parameter type to Partial<Borrowing> to match what's passed from the form.
    const handleSave = (borrowing: Partial<Borrowing>) => {
        addBorrowing(borrowing);
        toast.success('Data peminjaman baru berhasil ditambahkan.');
        setIsFormOpen(false);
    };

    const getItemName = (itemId: string) => items.find(i => i.id === itemId)?.name || 'Barang tidak ditemukan';

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Riwayat Peminjaman
                </h2>
                {canEdit && (
                  <button
                      onClick={() => setIsFormOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none"
                  >
                      Catat Peminjaman
                  </button>
                )}
            </div>

            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                                <th className="px-4 py-3">Barang</th>
                                <th className="px-4 py-3">Peminjam</th>
                                <th className="px-4 py-3">Tgl Pinjam</th>
                                <th className="px-4 py-3">Status</th>
                                {canEdit && <th className="px-4 py-3">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {borrowings.map((b) => (
                                <tr key={b.id} className="text-gray-700">
                                    <td className="px-4 py-3 text-sm font-semibold">{getItemName(b.itemId)}</td>
                                    <td className="px-4 py-3 text-sm">{b.borrowerName}</td>
                                    <td className="px-4 py-3 text-sm">{formatDate(b.borrowDate)}</td>
                                    <td className="px-4 py-3 text-xs">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${b.status === 'Dipinjam' ? 'text-yellow-700 bg-yellow-100' : 'text-green-700 bg-green-100'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    {canEdit && (
                                      <td className="px-4 py-3 text-sm">
                                          {b.status === 'Dipinjam' && (
                                              <button onClick={() => handleReturnClick(b)} className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
                                                  Kembalikan
                                              </button>
                                          )}
                                      </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <BorrowingFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {isConfirmOpen && borrowingToReturn && (
                <ConfirmationModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={confirmReturn}
                    title="Konfirmasi Pengembalian"
                    message={`Apakah Anda yakin ingin menandai "${getItemName(borrowingToReturn.itemId)}" sebagai 'Kembali'? Stok barang akan bertambah.`}
                />
            )}
        </>
    );
};

export default BorrowingsPage;
