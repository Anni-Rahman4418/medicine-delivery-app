import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon } from './Icons';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, login, register, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<'customer' | 'pharmacy'>('customer');
  const [pharmacyName, setPharmacyName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, role, pharmacyName: role === 'pharmacy' ? pharmacyName : undefined, address, phone });
      }
      setIsAuthOpen(false);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon btn-secondary" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setIsAuthOpen(false)}>
          <CloseIcon size={16} />
        </button>

        <h2 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: 20 }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">I am a</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value as any)}>
                  <option value="customer">Customer</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>
              {role === 'pharmacy' && (
                <div className="form-group">
                  <label className="form-label">Pharmacy name</label>
                  <input className="form-input" required value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={{ color: 'var(--accent-teal)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>

        {mode === 'login' && (
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Demo accounts (password: 123456): anni@medigo.com (customer),
            contact@greenleaf.com (pharmacy), admin@medigo.com (admin)
          </p>
        )}
      </div>
    </div>
  );
};
