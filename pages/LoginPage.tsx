
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { InventoryIcon } from '../constants/icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@inventory.com');
  const [password, setPassword] = useState('password'); // Dummy password for demo
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const commonInputStyle = "block w-full mt-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-200 focus:ring-opacity-50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } else {
      setError('Email atau password salah.');
      toast.error('Email atau password salah.');
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50">
      <div className="flex-1 h-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-center p-6 sm:p-12">
            <div className="w-full">
              <div className="flex justify-center mb-4">
                <InventoryIcon className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="mb-4 text-xl font-semibold text-center text-gray-700">
                Login
              </h1>
              <form onSubmit={handleSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-700">Email</span>
                  <input
                    className={commonInputStyle}
                    placeholder="john@doe.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">Password</span>
                  <input
                    className={commonInputStyle}
                    placeholder="***************"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-emerald-600 border border-transparent rounded-lg active:bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:shadow-outline-emerald"
                >
                  Log in
                </button>
              </form>
              {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
