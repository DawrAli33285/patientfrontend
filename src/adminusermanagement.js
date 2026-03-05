import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { BASE_URL } from './baseurl';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', credits: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [invoiceData, setInvoiceData] = useState({ price: '', description: '' });

  useEffect(() => { getUsers(); }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/getUsers`);
      const data = await response.json();
      setUsers(data.users || data || []);
    } catch (e) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ email: user.email, password: '', credits: user.credits || 0 });
  };

  const handleSave = async () => {
    try {
      const updateData = { email: formData.email, credits: parseFloat(formData.credits) || 0 };
      if (formData.password) updateData.password = formData.password;
      await fetch(`${BASE_URL}/updateUser/${editingUser}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      setUsers(users.map(u => u._id === editingUser ? { ...u, email: formData.email, credits: formData.credits } : u));
      setEditingUser(null);
      setFormData({ email: '', password: '', credits: 0 });
      alert('User updated successfully');
    } catch (e) {
      alert('Failed to update user. Please try again.');
    }
  };

  const handleSendInvoice = (userId) => {
    setSelectedUserId(userId);
    setShowInvoiceModal(true);
  };

  const submitInvoice = async () => {
    try {
      if (!invoiceData.price || !invoiceData.description) { alert('Please fill in all fields'); return; }
      await fetch(`${BASE_URL}/sendInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, price: parseFloat(invoiceData.price), description: invoiceData.description }),
      });
      setShowInvoiceModal(false);
      setInvoiceData({ price: '', description: '' });
      alert('Invoice sent successfully');
    } catch (e) {
      alert('Failed to send invoice. Please try again.');
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.email || !formData.password) { alert('Please fill in all fields'); return; }
      const response = await fetch(`${BASE_URL}/addUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setUsers([...users, data.user || data]);
      setShowAddModal(false);
      setFormData({ email: '', password: '' });
      alert('User added successfully');
    } catch (e) {
      alert('Failed to add user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) { alert('Error: User ID is undefined'); return; }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${BASE_URL}/deleteUser/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (e) {
      alert('Failed to delete user. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const s = {
    page: { padding: '24px', fontFamily: 'sans-serif' },
    pageHeader: { marginBottom: '32px' },
    pageTitle: { fontSize: '30px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' },
    pageSubtitle: { color: '#4b5563', margin: 0, fontSize: '14px' },

    // Cards
    card: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' },
    cardNopad: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },

    // Loading
    loadingWrapper: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '48px', textAlign: 'center' },
    spinner: { display: 'inline-block', width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { marginTop: '16px', color: '#4b5563' },

    // Error
    errorBox: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '24px' },
    errorText: { color: '#dc2626', margin: '0 0 8px 0' },
    retryBtn: { background: 'none', border: 'none', color: '#b91c1c', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '14px' },

    // Search row
    searchRow: { display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' },
    searchWrapper: { position: 'relative', flex: 1, minWidth: '200px' },
    searchIcon: { position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none', display: 'flex' },
    searchInput: { width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },

    // Table
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' },
    thRight: { padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#374151' },
    tr: { borderBottom: '1px solid #f3f4f6' },
    td: { padding: '16px 24px', fontSize: '14px', color: '#4b5563' },
    tdRight: { padding: '16px 24px', textAlign: 'right' },

    // Avatar
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '16px', flexShrink: 0 },
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    userName: { fontWeight: '500', color: '#1f2937', margin: 0 },
    emailCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' },
    dateCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' },
    actionsRow: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' },

    // Inline edit inputs
    inlineInput: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' },
    inlineInputNarrow: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', width: '80px' },

    // Icon buttons
    iconBtnGreen: { padding: '8px', color: '#16a34a', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    iconBtnGray: { padding: '8px', color: '#4b5563', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    iconBtnBlue: { padding: '8px', color: '#2563eb', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    iconBtnRed: { padding: '8px', color: '#dc2626', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },

    // Empty state
    emptyTd: { padding: '48px 24px', textAlign: 'center', color: '#6b7280' },

    // Modal overlay
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' },
    modal: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', padding: '32px', width: '100%', maxWidth: '448px' },
    modalTitle: { fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 24px 0' },
    modalGroup: { marginBottom: '16px' },
    modalLabel: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
    modalInput: { width: '100%', boxSizing: 'border-box', padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    modalTextarea: { width: '100%', boxSizing: 'border-box', padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' },
    modalActions: { display: 'flex', gap: '16px', marginTop: '24px' },
    btnPrimary: { flex: 1, backgroundColor: '#2563eb', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    btnSecondary: { flex: 1, backgroundColor: '#e5e7eb', color: '#1f2937', padding: '10px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>User Management</h1>
        <p style={s.pageSubtitle}>Manage all users and their access permissions</p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={s.loadingWrapper}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Loading users...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={s.errorBox}>
          <p style={s.errorText}>{error}</p>
          <button onClick={getUsers} style={s.retryBtn}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Search bar */}
          <div style={s.card}>
            <div style={s.searchRow}>
              <div style={s.searchWrapper}>
                <span style={s.searchIcon}><Search size={20} /></span>
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={s.searchInput}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={s.cardNopad}>
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead style={s.thead}>
                  <tr>
                    <th style={s.th}>User</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Password</th>
                   
                  
                    <th style={s.thRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={s.emptyTd}>No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} style={s.tr}>
                        {/* User */}
                        <td style={s.td}>
                          <div style={s.userCell}>
                            <div style={s.avatar}>{user.email.charAt(0).toUpperCase()}</div>
                            <p style={s.userName}>{user.email.split('@')[0]}</p>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={s.td}>
                          {editingUser === user._id ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              style={s.inlineInput}
                            />
                          ) : (
                            <div style={s.emailCell}>
                              <Mail size={16} />
                              <span>{user.email}</span>
                            </div>
                          )}
                        </td>

                        {/* Password */}
                        <td style={s.td}>
                          {editingUser === user._id ? (
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Leave blank to keep current"
                              style={s.inlineInput}
                            />
                          ) : (
                            <span>••••••••</span>
                          )}
                        </td>

                        {/* Credits */}
                       


                        {/* Actions */}
                        <td style={s.tdRight}>
                          <div style={s.actionsRow}>
                            {editingUser === user._id ? (
                              <>
                                <button onClick={handleSave} style={s.iconBtnGreen} title="Save">
                                  <CheckCircle size={20} />
                                </button>
                                <button onClick={() => { setEditingUser(null); setFormData({ email: '', password: '', credits: 0 }); }} style={s.iconBtnGray} title="Cancel">
                                  <XCircle size={20} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(user)} style={s.iconBtnBlue} title="Edit">
                                  <Edit size={20} />
                                </button>
                                <button onClick={() => handleDelete(user._id)} style={s.iconBtnRed} title="Delete">
                                  <Trash2 size={20} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>Add New User</h2>
            <div style={s.modalGroup}>
              <label style={s.modalLabel}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={s.modalInput}
                placeholder="user@example.com"
              />
            </div>
            <div style={s.modalGroup}>
              <label style={s.modalLabel}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={s.modalInput}
                placeholder="Enter password"
              />
            </div>
            <div style={s.modalActions}>
              <button onClick={handleAdd} style={s.btnPrimary}>Add User</button>
              <button onClick={() => { setShowAddModal(false); setFormData({ email: '', password: '' }); }} style={s.btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Modal */}
      {showInvoiceModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>Send Invoice</h2>
            <div style={s.modalGroup}>
              <label style={s.modalLabel}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={invoiceData.price}
                onChange={(e) => setInvoiceData({ ...invoiceData, price: e.target.value })}
                style={s.modalInput}
                placeholder="0.00"
              />
            </div>
            <div style={s.modalGroup}>
              <label style={s.modalLabel}>Description</label>
              <textarea
                value={invoiceData.description}
                onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
                style={s.modalTextarea}
                placeholder="Invoice description"
                rows="3"
              />
            </div>
            <div style={s.modalActions}>
              <button onClick={submitInvoice} style={s.btnPrimary}>Send Invoice</button>
              <button onClick={() => { setShowInvoiceModal(false); setInvoiceData({ price: '', description: '' }); }} style={s.btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}