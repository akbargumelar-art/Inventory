import React from 'react';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="h-full overflow-y-auto md:pb-0 pb-20">
            <div className="container px-6 py-8 mx-auto grid">
                {children}
            </div>
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
};

export default Layout;