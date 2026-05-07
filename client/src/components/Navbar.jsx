import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/5g', label: 'Private 5G' },
  { to: '/news', label: 'News & Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #262626',
      transition: 'background-color 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Trinergy Logo" style={{ height: 40, objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#f5f5f5',
          }}>
            TRINERGY
          </span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', gap: 4, listStyle: 'none', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? '#4ade80' : '#a3a3a3',
                  backgroundColor: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  display: 'block',
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            flexDirection: 'column',
            gap: 5,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? '#4ade80' : '#f5f5f5', transition: 'all 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? '#4ade80' : '#f5f5f5', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: menuOpen ? '#4ade80' : '#f5f5f5', transition: 'all 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #262626',
          backgroundColor: '#0a0a0a',
          padding: '12px 0',
        }}>
          <ul style={{ listStyle: 'none', padding: '0 24px' }}>
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '10px 0',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: isActive ? '#4ade80' : '#a3a3a3',
                    borderBottom: '1px solid #1a1a1a',
                  })}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
