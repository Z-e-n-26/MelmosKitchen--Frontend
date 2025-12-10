import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Users.css';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', password: '', role: 'staff'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ username: '', name: '', email: '', password: '', role: 'staff' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        await api.put(`/auth/users/${editingUser.id}`, formData);
      } else {
        // Create user
        await api.post('/auth/register', formData);
      }
      setIsModalOpen(false);
      setFormData({ username: '', name: '', email: '', password: '', role: 'staff' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <>
      <div>
        <div className="users-header">
          <div className="users-title-section">
            <h2>User Management</h2>
            <p>Manage admin and staff accounts</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            + Add User
          </button>
        </div>

        <div className="users-table-wrapper">
          <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-400">Loading users...</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td className="font-medium text-slate-900">{user.username}</td>
                      <td className="text-slate-500">{user.name || '-'}</td>
                      <td className="text-slate-500">{user.email || '-'}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-green'}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-slate-500 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleOpenEdit(user)}
                            className="text-blue-400 hover:text-blue-600 p-1 transition-colors"
                            title="Edit User"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-400 hover:text-red-600 p-1 transition-colors"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-stack">
              <div>
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="Enter username"
                  required
                  disabled={editingUser !== null}
                />
              </div>

              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="form-label">Password {editingUser && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="Min. 6 characters"
                  required={!editingUser}
                  minLength="6"
                />
              </div>
              
              <div>
                <label className="form-label">User Role *</label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="staff">Staff - View & Add Stock</option>
                  <option value="admin">Admin - Full Access</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
