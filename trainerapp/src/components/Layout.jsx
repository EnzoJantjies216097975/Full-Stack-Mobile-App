import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Users, Activity, Calendar, Dumbbell, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
    { path: '/programs', icon: Activity, label: 'Programs' },
    { path: '/classes', icon: Calendar, label: 'Classes' },
    { path: '/trainees', icon: Users, label: 'Trainees' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Fitness Bootcamp</h1>
          </div>
          <nav className="flex-1 p-4">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center p-3 mb-2 rounded-lg ${
                  location.pathname === path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">{user?.name || 'Trainer'}</p>
                <p className="text-sm text-gray-500">Trainer</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;