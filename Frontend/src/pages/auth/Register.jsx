import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Compass, Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';

export const Register = () => {
  const { signup, demoLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) newErrors.terms = 'You must accept the terms of service';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      addToast('Welcome to GlobeTrotter! Your account is ready.', 'success');
      navigate('/dashboard', { replace: true });
    } catch {
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
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
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Start planning smart multi-city trips and itineraries today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
          <Input
            label="Full Name"
            id="register-name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            id="register-email"
            type="email"
            placeholder="traveler@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            id="register-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password"
            id="register-confirm-password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            icon={Lock}
            required
          />

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                color: '#475569',
              }}
            >
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                }}
                style={{ accentColor: '#15803d', marginTop: '3px' }}
              />
              <span>
                I agree to the Terms of Service, Privacy Policy, and travel planning data storage.
              </span>
            </label>
            {errors.terms && <p className="form-error" style={{ marginTop: '4px' }}>{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={UserPlus}
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Demo login shortcut */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => {
              demoLogin('traveler');
              addToast('Quick signed in as Demo Traveler', 'success');
              navigate('/dashboard');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#15803d',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={14} /> Try Instant Demo Account
          </button>
        </div>

        {/* Switch to Login */}
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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: '#15803d' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
