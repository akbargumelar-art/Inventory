import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import { DashboardIcon, BoxIcon, ClipboardListIcon, UsersIcon, LocationIcon, CategoryIcon, InventoryIcon } from '../../constants/icons';

const navLinks = [
  { to: '/dashboard', icon: DashboardIcon, text: 'Dashboard' },
  { to: '/items', icon: BoxIcon, text: 'Barang' },
  { to: '/locations', icon: LocationIcon, text: 'Lokasi' },
  { to: '/categories', icon: CategoryIcon, text: 'Kategori' },
  { to: '/borrowings', icon: ClipboardListIcon, text: 'Peminjaman' },
  { to: '/users', icon: UsersIcon, text: 'Pengguna' },
];

const NavItem: React.FC<{ to: string; icon: React.FC<any>; text: string; isSidebarOpen: boolean; openSidebar: () => void }> = ({ to, icon: Icon, text, isSidebarOpen, openSidebar }) => (
    <li className="relative group" onClick={() => !isSidebarOpen && openSidebar()}>
        <NavLink
            to={to}
            end
            className={({ isActive }) => `flex items-center w-full py-3 text-sm font-semibold transition-colors duration-150 hover:text-gray-800 ${isActive ? 'text-emerald-600' : 'text-gray-500'} ${isSidebarOpen ? 'px-4' : 'justify-center'}`}
        >
            {({ isActive }) => (
                <>
                    {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-emerald-600 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>}
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`ml-4 overflow-hidden whitespace-nowrap transition-all duration-200 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>{text}</span>
                </>
            )}
        </NavLink>
        {!isSidebarOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                {text}
            </div>
        )}
    </li>
);

const Sidebar: React.FC = () => {
  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, closeSidebar]);

  return (
    <aside ref={sidebarRef} className={`relative z-40 flex-shrink-0 hidden md:flex flex-col bg-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-40' : 'w-16'}`}>
      <div className="py-4 text-gray-500 flex-grow">
        <div 
          className={`flex items-center transition-all duration-300 cursor-pointer ${isSidebarOpen ? 'ml-6' : 'justify-center'}`}
          onClick={openSidebar}
        >
            <InventoryIcon className="w-6 h-6 mr-2 text-emerald-600 flex-shrink-0" />
            <span className={`font-bold text-gray-800 overflow-hidden whitespace-nowrap transition-all duration-200 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>InventoriApp</span>
        </div>
        <ul className="mt-6">
          {navLinks.map(link => (
            <NavItem key={link.to} {...link} isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;