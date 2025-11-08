
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './hooks/useData';
import { AuthProvider } from './hooks/useAuth';
import { SidebarProvider } from './hooks/useSidebar';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import LocationsPage from './pages/LocationsPage';
import CategoriesPage from './pages/CategoriesPage';
import UsersPage from './pages/UsersPage';
import BorrowingsPage from './pages/BorrowingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <SidebarProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/borrowings" element={<BorrowingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/" element={<DashboardPage />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter>
          <Toaster position="top-center" reverseOrder={false} />
        </SidebarProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
