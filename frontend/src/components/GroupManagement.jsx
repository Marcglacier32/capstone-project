// src/components/GroupManagement.jsx
// GroupManagement component for creating and managing groups with enhanced UI
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const GroupManagement = () => {
  const [groupName, setGroupName] = useState('');
  const [signatories, setSignatories] = useState(1);
  const [amount, setAmount] = useState('');
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
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

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
        body: JSON.stringify({ name: groupName, signatories }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setGroupName('');
        setSignatories(1);
        fetchGroups();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to connect to server');
    }
  };

  const handleUpdateGroup = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
        body: JSON.stringify({ name: groupName, signatories }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setEditingGroup(null);
        setGroupName('');
        setSignatories(1);
        fetchGroups();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update group');
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchGroups();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete group');
    }
  };

  const handleDeposit = async (groupId) => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies
        body: JSON.stringify({ amount, group_id: groupId, type: 'deposit' }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAmount('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to record deposit');
    }
  };

  const startEditing = (group) => {
    setEditingGroup(group.id);
    setGroupName(group.name);
    setSignatories(group.signatories);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Manage Groups</h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto mb-8 transform transition-all hover:scale-105">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {editingGroup ? 'Edit Group' : 'Create Group'}
        </h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="signatories" className="block text-sm font-medium text-gray-700">
              Number of Signatories
            </label>
            <input
              id="signatories"
              type="number"
              placeholder="Enter number of signatories"
              value={signatories}
              onChange={(e) => setSignatories(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            onClick={editingGroup ? () => handleUpdateGroup(editingGroup) : handleCreateGroup}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition transform hover:-translate-y-1"
          >
            {editingGroup ? 'Update Group' : 'Create Group'}
          </button>
          {editingGroup && (
            <button
              onClick={() => {
                setEditingGroup(null);
                setGroupName('');
                setSignatories(1);
              }}
              className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-700">{group.name}</h3>
            <p className="text-sm text-gray-600">Signatories: {group.signatories}</p>
            <div className="mt-4 space-y-2">
              <input
                type="number"
                placeholder="Deposit amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                onClick={() => handleDeposit(group.id)}
                className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
              >
                Deposit
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEditing(group)}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManagement;