// src/components/Dashboard.jsx
// Dashboard component displaying user financial overview with enhanced UI
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchTransactions();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
      });
      const data = await response.json();
      if (response.ok) {
        setGroups(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch groups');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700">Your Savings</h3>
          <p className="text-2xl font-bold text-indigo-600">
            ${transactions.reduce((sum, tx) => sum + (tx.type === 'deposit' ? tx.amount : 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700">Active Groups</h3>
          <p className="text-2xl font-bold text-indigo-600">{groups.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
          <p className="text-2xl font-bold text-indigo-600">{transactions.length}</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
        {transactions.length > 0 ? (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li key={tx.id} className="text-sm text-gray-600">
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} of ${tx.amount.toFixed(2)} to Group ID {tx.group_id} on {new Date(tx.timestamp).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;