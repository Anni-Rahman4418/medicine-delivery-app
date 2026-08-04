import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchIcon, TruckIcon, ShieldIcon } from './Icons';

export const HeroBanner: React.FC = () => {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div style={{ padding: '48px 24px 32px', textAlign: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 12 }}>
          Medicines delivered <span className="text-gradient">to your door</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '1.05rem' }}>
          Order from trusted local pharmacies. Upload a prescription when needed, track delivery in real time.
        </p>

        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto 20px' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <SearchIcon size={18} color="var(--text-dim)" />
          </span>
          <input
            className="form-input"
            style={{ paddingLeft: 44, borderRadius: 'var(--radius-full)' }}
            placeholder="Search medicines, e.g. paracetamol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TruckIcon size={16} color="var(--accent-teal)" /> 45-min average delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldIcon size={16} color="var(--accent-teal)" /> Pharmacist-verified prescriptions
          </div>
        </div>
      </div>
    </div>
  );
};
