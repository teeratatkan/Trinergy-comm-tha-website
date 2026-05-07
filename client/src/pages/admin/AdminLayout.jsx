import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/products', label: 'Products', icon: '⬡' },
  { to: '/admin/info', label: 'Company Info', icon: '◎' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 0,
        overflow: 'hidden',
        backgroundColor: '#0d0d0d',
        borderRight: '1px solid #262626',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1a1a1a', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Trinergy" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#f5f5f5',
            }}>
              TRINERGY
            </span>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#404040', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8, whiteSpace: 'nowrap' }}>
            ADMIN MENU
          </p>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: '0.85rem',
                color: isActive ? '#4ade80' : '#a3a3a3',
                backgroundColor: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
                marginBottom: 4,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #1a1a1a', whiteSpace: 'nowrap' }}>
            <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80' }}>{user.username}</p>
            <p style={{ fontSize: '0.65rem', color: '#404040', marginTop: 2 }}>Administrator</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          height: 56,
          backgroundColor: '#0d0d0d',
          borderBottom: '1px solid #262626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '1rem', padding: 4 }}
            >
              ☰
            </button>
            <h1 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#f5f5f5' }}>
              Admin Panel
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#a3a3a3', fontFamily: 'var(--font-mono)' }}>
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #262626',
                borderRadius: 6,
                padding: '6px 14px',
                color: '#a3a3a3',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
