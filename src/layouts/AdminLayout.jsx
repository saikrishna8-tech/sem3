import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Package className="h-8 w-8 text-gold-dark dark:text-gold" />
          <span className="ml-2 text-2xl font-black text-slate-800 dark:text-white">AuraAdmin</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/admin" className="flex items-center px-4 py-3 text-gold-dark dark:text-gold bg-gold/10 dark:bg-gold/20 rounded-lg font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">
            <Package className="h-5 w-5 mr-3" />
            Products
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">
            <Users className="h-5 w-5 mr-3" />
            Customers
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors mb-2">
            <ChevronLeft className="h-5 w-5 mr-3" />
            Back to Store
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Admin Portal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Welcome, {user?.name || 'Admin'}</span>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gold to-gold-dark flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
