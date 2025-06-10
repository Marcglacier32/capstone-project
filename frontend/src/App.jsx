// src/App.jsx
// Main app component with routing for Proxima Centauri
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import GroupManagement from './components/GroupManagement';
import Help from './components/Help';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const handleSignup = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {isLoggedIn && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />} />
            <Route path="/groups" element={isLoggedIn ? <GroupManagement /> : <Login onLogin={handleLogin} />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        <footer className="bg-indigo-800 text-white text-center py-4">
          <p className="text-sm">© 2025 Proxima Centauri. All rights reserved.</p>
        </footer>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;