import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { MOCK_ADMIN_STATS } from '../../utils/mockData';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/dateUtils';
import { Search, UserCheck, Shield, Trash2 } from 'lucide-react';

export const UserTable = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState(MOCK_ADMIN_STATS.recentUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getUsers();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mappedUsers = res.data.map((u) => ({
            id: u.id,
            name: u.name,
            username: u.username,
            email: u.email,
            role: u.role === 'admin' ? 'Admin' : 'Traveler',
            tripsCount: 1,
            joinedDate: u.created_at || new Date().toISOString(),
            status: 'Active',
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.warn('Admin users API note:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user account for ${userName}?`)) {
      return;
    }

    try {
      if (typeof userId === 'number' || !isNaN(Number(userId))) {
        await adminService.deleteUser(userId);
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addToast(`User ${userName} removed successfully`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to remove user', 'error');
    }
  };

  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          addToast(`User ${u.name} is now ${newStatus}`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            User Management & Platform Accounts
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Review registered travelers, plan creators, and permissions
          </p>
        </div>

        <div className="search-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="search-input"
            style={{ padding: '8px 12px 8px 36px', fontSize: '0.875rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 12px' }}>Traveler / User</th>
              <th style={{ padding: '10px 12px' }}>Role</th>
              <th style={{ padding: '10px 12px' }}>Joined Date</th>
              <th style={{ padding: '10px 12px' }}>Status</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((usr) => (
              <tr
                key={usr.id}
                style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px' }}>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{usr.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{usr.email}</p>
                </td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: usr.role === 'Admin' ? '#fef3c7' : '#f0fdf4',
                      color: usr.role === 'Admin' ? '#b45309' : '#15803d',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${usr.role === 'Admin' ? '#fde68a' : '#bbf7d0'}`,
                    }}
                  >
                    {usr.role}
                  </span>
                </td>
                <td style={{ padding: '12px', color: '#64748b' }}>
                  {formatDate(usr.joinedDate)}
                </td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: usr.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                      color: usr.status === 'Active' ? '#15803d' : '#dc2626',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: `1px solid ${usr.status === 'Active' ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    {usr.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <Button
                      variant={usr.status === 'Active' ? 'ghost' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleUserStatus(usr.id)}
                    >
                      {usr.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                    {usr.role !== 'Admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteUser(usr.id, usr.name)}
                        style={{ color: '#dc2626' }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
