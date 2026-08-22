import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import {
  Compass,
  MapPin,
  Calendar,
  Plus,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  Plane,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'My Trips', path: '/trips', icon: Plane },
    { label: 'Explore Cities', path: '/cities', icon: MapPin },
    { label: 'Activities', path: '/activities', icon: Sparkles },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#15803d',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              GlobeTrotter
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Travel Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: active ? '#15803d' : '#475569',
                  backgroundColor: active ? '#f0fdf4' : 'transparent',
                  border: active ? '1px solid #bbf7d0' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} color={active ? '#15803d' : '#64748b'} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/trips/new')}
            style={{ display: 'none' }}
            className="desktop-cta"
          >
            Plan New Trip
          </Button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px 4px 4px',
                  borderRadius: '9999px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                }}
                aria-expanded={isProfileMenuOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'none',
                  }}
                  className="user-name-label"
                >
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '44px',
                      width: '240px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      padding: '8px',
                      zIndex: 120,
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #f1f5f9',
                        marginBottom: '6px',
                      }}
                    >
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</p>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          marginTop: '4px',
                          color: user.role === 'admin' ? '#b45309' : '#15803d',
                        }}
                      >
                        Role: {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#334155',
                        textDecoration: 'none',
                      }}
                      className="dropdown-item"
                    >
                      <User size={16} /> Profile & Settings
                    </Link>

                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => {
                          demoLogin('admin');
                          setIsProfileMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#15803d',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        className="dropdown-item"
                      >
                        <Shield size={16} /> Switch to Admin Mode
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          demoLogin('traveler');
                          setIsProfileMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#15803d',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        className="dropdown-item"
                      >
                        <Compass size={16} /> Switch to Traveler Mode
                      </button>
                    )}

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '6px', paddingTop: '6px' }}>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                          navigate('/login');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#dc2626',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        className="dropdown-item"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '16px 20px',
          }}
          className="mobile-nav"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? '#15803d' : '#475569',
                    backgroundColor: active ? '#f0fdf4' : 'transparent',
                    border: active ? '1px solid #bbf7d0' : 'none',
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/trips/new');
            }}
            style={{ width: '100%' }}
          >
            Plan New Trip
          </Button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: inline-flex !important;
          }
          .user-name-label {
            display: inline !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        .dropdown-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </header>
  );
};
