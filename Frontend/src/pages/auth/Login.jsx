import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Compass, Mail, Lock, LogIn, Sparkles, Shield, User, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, demoLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      addToast('Welcome back to GlobeTrotter!', 'success');
      const userRole = res?.user?.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.message || 'Invalid username/email or password. Please verify or register an account.';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    demoLogin(role);
    addToast(`Logged in as Demo ${role === 'admin' ? 'Admin' : 'Traveler'}`, 'success');
    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      addToast('Please enter your email address', 'error');
      return;
    }
    try {
      await authService.forgotPassword(resetEmail);
      setIsForgotModalOpen(false);
      addToast(`Password reset link generated for ${resetEmail}`, 'success');
      setResetEmail('');
    } catch (err) {
      addToast(err.message || 'Unable to request password reset', 'error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <Compass size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome to GlobeTrotter
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sign in to manage your multi-city trips and itineraries
          </p>
        </div>

        {/* Error banner from backend */}
        {errors.form && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.875rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <Input
            label="Email Address or Username"
            id="login-email"
            type="text"
            placeholder="e.g. traveler@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email || errors.form) setErrors((prev) => ({ ...prev, email: '', form: '' }));
            }}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password || errors.form) setErrors((prev) => ({ ...prev, password: '', form: '' }));
            }}
            error={errors.password}
            icon={Lock}
            required
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#15803d' }}
              />
              <span style={{ color: '#475569' }}>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803d',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={LogIn}
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* 1-Click Quick Demo Login box */}
        <div className="demo-account-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={16} color="#15803d" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534' }}>
              Quick 1-Click Demo Login
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={User}
              onClick={() => handleDemoLogin('traveler')}
            >
              Demo Traveler
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Shield}
              onClick={() => handleDemoLogin('admin')}
            >
              Demo Admin
            </Button>
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.875rem',
            color: '#64748b',
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: '#15803d' }}>
            Create an Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Password"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResetPassword}>
              Send Reset Link
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
          Enter the email address associated with your GlobeTrotter account, and we'll send you instructions to reset your password.
        </p>
        <Input
          label="Your Email"
          id="reset-email"
          type="email"
          placeholder="traveler@example.com"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          icon={Mail}
          required
        />
      </Modal>
    </div>
  );
};
