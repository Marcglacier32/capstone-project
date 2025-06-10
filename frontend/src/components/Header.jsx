// src/components/Header.jsx
// Navigation header for Proxima Centauri app with enhanced UI
import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
      });
      const data = await response.json();
      toast.success(data.message);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="bg-indigo-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold tracking-tight hover:text-indigo-300 transition">
          Proxima Centauri
        </Link>
        <nav className="space-x-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-300 transition">
            Dashboard
          </Link>
          <Link to="/groups" className="text-sm font-medium hover:text-indigo-300 transition">
            Groups
          </Link>
          <Link to="/help" className="text-sm font-medium hover:text-indigo-300 transition">
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:text-indigo-300 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;