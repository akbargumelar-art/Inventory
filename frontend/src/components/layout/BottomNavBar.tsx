import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, BoxIcon, ClipboardListIcon, UsersIcon, PlusIcon } from '../../constants/icons';
import ItemFormModal from '../items/ItemFormModal';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { Item } from '../../types';
import toast from 'react-hot-toast';


const navLinks = [
  { to: '/dashboard', icon: DashboardIcon, text: 'Dashboard' },
  { to: '/items', icon: BoxIcon, text: 'Barang' },
  { to: '/borrowings', icon: ClipboardListIcon, text: 'Pinjam' },
  { to: '/users', icon: UsersIcon, text: 'Pengguna' },
];

const BottomNavBar: React.FC = () => {
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const { addItem } = useData();
    const { user } = useAuth();

    const handleSaveItem = (item: Item) => {
        addItem(item);
        toast.success(`Barang "${item.name}" berhasil ditambahkan.`);
        setIsItemFormOpen(false);
    };

    const NavItem: React.FC<{ to: string; icon: React.FC<any>; text: string }> = ({ to, icon: Icon, text }) => (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-gray-500'
                }`
            }
        >
            <Icon className="w-6 h-6 mb-1" />
            <span>{text}</span>
        </NavLink>
    );
    
    // Fix: Add role check for displaying the add button
    const canEdit = user?.role === 'Administrator' || user?.role === 'Input Data';

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-20 h-16 bg-white border-t border-gray-200 shadow-lg md:hidden">
                <div className="flex items-center justify-around w-full h-full">
                <NavItem {...navLinks[0]} />
                <NavItem {...navLinks[1]} />

                <div className="w-1/5">
                    {canEdit && (
                      <button
                          onClick={() => setIsItemFormOpen(true)}
                          className="relative z-10 flex items-center justify-center w-14 h-14 mx-auto -mt-8 text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          aria-label="Tambah Barang"
                      >
                          <PlusIcon className="w-8 h-8" />
                      </button>
                    )}
                </div>

                <NavItem {...navLinks[2]} />
                {user?.role === 'Administrator' ? (
                  <NavItem {...navLinks[3]} />
                ) : (
                  <div className="w-1/5" />
                )}
                </div>
            </div>
            {isItemFormOpen && (
                <ItemFormModal
                    isOpen={isItemFormOpen}
                    onClose={() => setIsItemFormOpen(false)}
                    onSave={handleSaveItem}
                    item={null}
                />
            )}
        </>
    );
};

export default BottomNavBar;