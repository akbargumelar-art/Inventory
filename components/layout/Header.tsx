
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDownIcon, UsersIcon, LogoutIcon } from '../../constants/icons';

const Header: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLLIElement>(null);

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/items': return 'Manajemen Barang';
      case '/locations': return 'Manajemen Lokasi';
      case '/categories': return 'Kategori Barang';
      case '/users': return 'Manajemen Pengguna';
      case '/borrowings': return 'Peminjaman';
      case '/profile': return 'Profil Saya';
      default: return 'InventoriApp';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!currentUser) return null;

  return (
    <header className="z-30 py-4 bg-white shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-gray-600">
        <h1 className="text-lg font-semibold">{getTitle()}</h1>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative" ref={profileMenuRef}>
            <button 
              className="align-middle rounded-full focus:shadow-outline-emerald focus:outline-none" 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Account" 
              aria-haspopup="true"
            >
              <div className="flex items-center">
                <img className="object-cover w-8 h-8 rounded-full" src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt={currentUser.name} aria-hidden="true" />
                <span className="hidden ml-2 md:inline">{currentUser.name}</span>
                <ChevronDownIcon className={`hidden w-4 h-4 ml-1 md:inline transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}/>
              </div>
            </button>
            {isProfileMenuOpen && (
              <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md" aria-label="submenu">
                <li className="flex">
                  <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800">
                    <UsersIcon className="w-4 h-4 mr-3" />
                    <span>Profil</span>
                  </Link>
                </li>
                <li className="flex">
                  <button onClick={handleLogout} className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800">
                    <LogoutIcon className="w-4 h-4 mr-3" />
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;